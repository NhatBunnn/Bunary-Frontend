import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import {
  ShoppingBag,
  Zap,
  Gem,
  Search,
  Package,
  Sparkles,
  Flame,
  ShieldCheck,
  RotateCcw,
  Check,
  X,
  Plus,
} from "lucide-react";
import styles from "./Shop.module.css";
import { useUser } from "@context/UserProvider/UserProvider";
import { useNotification } from "@context/NotificationProvider";
import { useFetcher } from "@api/fetcher";
import {
  getShopOverview,
  buyShopItem,
  toggleEquipShopItem,
  useShopPowerup,
} from "@api/shopApi";
import {
  BANNER_STYLES,
  EFFECT_STYLES,
  NAMEPLATE_COLORS,
  saveEquippedCosmetics,
} from "@utils/cosmetics";
import {
  SHOP_CATEGORIES,
  CURRENCY_FILTERS,
  RARITY_META,
  INITIAL_SHOP_ITEMS,
} from "./shopMockData";

const c = classNames.bind(styles);

const CAT_LABELS = {
  AVATAR_DECO: "Khung Avatar",
  BANNER: "Banner",
  PROFILE_EFFECT: "Hiệu ứng",
  NAMEPLATE: "Thẻ tên",
  POWERUP: "Học tập",
};

function normalizeItem(raw) {
  const assetKey = raw.assetKey || raw.decoClass || raw.bannerClass || raw.previewClass || raw.nameClass || raw.powerupIcon;
  return {
    id: raw.id,
    code: raw.code || raw.id,
    name: raw.name,
    category: raw.category,
    catLabel: raw.catLabel || CAT_LABELS[raw.category] || raw.category,
    rarity: raw.rarity || "COMMON",
    currency: raw.currencyType || raw.currency || "SPARK",
    price: raw.price ?? 0,
    assetKey,
    decoClass: raw.category === "AVATAR_DECO" ? assetKey : raw.decoClass,
    bannerClass: raw.category === "BANNER" ? assetKey : raw.bannerClass,
    previewClass: raw.category === "PROFILE_EFFECT" ? assetKey : raw.previewClass,
    effectStyle: raw.effectStyle || EFFECT_STYLES[assetKey],
    nameClass: raw.category === "NAMEPLATE" ? assetKey : raw.nameClass,
    nameColor: raw.nameColor || NAMEPLATE_COLORS[assetKey],
    powerupIcon: raw.powerupIcon || assetKey,
    desc: raw.description || raw.desc || "",
    consumable: Boolean(raw.consumable),
    owned: Boolean(raw.owned),
    equipped: Boolean(raw.equipped),
    quantity: raw.quantity ?? (raw.owned ? 1 : 0),
  };
}

function Shop() {
  const { user, refetchUser } = useUser();
  const { showNotification } = useNotification();
  const { fetcher } = useFetcher();

  const [usingApi, setUsingApi] = useState(false);
  const [items, setItems] = useState(() => INITIAL_SHOP_ITEMS.map(normalizeItem));
  const [spark, setSpark] = useState(1450);
  const [crystal, setCrystal] = useState(65);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [currencyFilter, setCurrencyFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [inventoryOnly, setInventoryOnly] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [equipped, setEquipped] = useState({
    AVATAR_DECO: "deco-indigo",
    BANNER: "bn-slate",
    PROFILE_EFFECT: null,
    NAMEPLATE: null,
  });

  const syncFromPayload = (payload) => {
    if (!payload) return;
    const normalized = (payload.items || []).map(normalizeItem);
    setItems(normalized);
    setSpark(payload.sparkBalance ?? 0);
    setCrystal(payload.crystalBalance ?? 0);

    const nextEquipped = {
      AVATAR_DECO: payload.equippedByCategory?.AVATAR_DECO || null,
      BANNER: payload.equippedByCategory?.BANNER || null,
      PROFILE_EFFECT: payload.equippedByCategory?.PROFILE_EFFECT || null,
      NAMEPLATE: payload.equippedByCategory?.NAMEPLATE || null,
    };
    setEquipped(nextEquipped);
    syncCosmeticsStorage(normalized, nextEquipped);
  };

  const syncCosmeticsStorage = (itemList, eqMap) => {
    const findKey = (cat) => {
      const id = eqMap[cat];
      if (!id) return null;
      return itemList.find((i) => i.id === id)?.assetKey || null;
    };
    saveEquippedCosmetics({
      avatarFrame: findKey("AVATAR_DECO"),
      bannerTheme: findKey("BANNER"),
      profileEffect: findKey("PROFILE_EFFECT"),
      nameplate: findKey("NAMEPLATE"),
    });
  };

  useEffect(() => {
    let mounted = true;
    const loadShop = async () => {
      try {
        const res = await getShopOverview(fetcher);
        if (mounted && res?.data?.items) {
          setUsingApi(true);
          syncFromPayload(res.data);
        }
      } catch {
        // Fallback silently to mock items if backend isn't running or unauthenticated
      }
    };
    loadShop();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ownedCount = useMemo(
    () => items.filter((item) => item.owned).length,
    [items]
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (inventoryOnly && !item.owned) return false;
      if (activeCategory !== "ALL" && item.category !== activeCategory)
        return false;
      if (currencyFilter !== "ALL" && item.currency !== currencyFilter)
        return false;
      if (
        search.trim() &&
        !item.name.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [items, inventoryOnly, activeCategory, currencyFilter, search]);

  const previewEquipped = useMemo(() => {
    if (!hoveredItem || hoveredItem.consumable) return equipped;
    return {
      ...equipped,
      [hoveredItem.category]: hoveredItem.id,
    };
  }, [equipped, hoveredItem]);

  const getEquippedItem = (cat) =>
    items.find((i) => i.id === previewEquipped[cat]) || null;

  const activeDeco = getEquippedItem("AVATAR_DECO");
  const activeBanner = getEquippedItem("BANNER");
  const activeEffect = getEquippedItem("PROFILE_EFFECT");
  const activeNameplate = getEquippedItem("NAMEPLATE");

  const displayName = user?.fullName || "Học viên Bunary";
  const displayUsername = user?.username || "bunary_user";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const handleToggleEquip = async (item) => {
    if (!item.owned || item.consumable || submitting) return;
    if (usingApi) {
      try {
        setSubmitting(true);
        const res = await toggleEquipShopItem(fetcher, item.id);
        if (res?.data) syncFromPayload(res.data);
        const willEquip = equipped[item.category] !== item.id;
        showNotification(
          willEquip ? `Đã trang bị "${item.name}"` : `Đã tháo "${item.name}"`,
          "success"
        );
      } catch (err) {
        showNotification(err?.message || "Không thể cập nhật trang bị", "error");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setEquipped((prev) => {
      const nextId = prev[item.category] === item.id ? null : item.id;
      const nextMap = { ...prev, [item.category]: nextId };
      syncCosmeticsStorage(items, nextMap);
      showNotification(
        nextId ? `Đã trang bị "${item.name}"` : `Đã tháo "${item.name}"`,
        "success"
      );
      return nextMap;
    });
  };

  const handleUsePowerup = async (item) => {
    if (submitting) return;
    if (usingApi) {
      try {
        setSubmitting(true);
        const res = await useShopPowerup(fetcher, item.id);
        if (res?.data) syncFromPayload(res.data);
        showNotification(`Đã kích hoạt ${item.name}!`, "success");
        if (selectedItem?.id === item.id) setSelectedItem(null);
      } catch (err) {
        showNotification(err?.message || "Không thể sử dụng vật phẩm", "error");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, owned: false } : i))
    );
    showNotification(`Đã kích hoạt ${item.name}!`, "success");
    if (selectedItem?.id === item.id) setSelectedItem(null);
  };

  const handleBuy = async (item) => {
    if (item.owned || submitting) return;

    if (usingApi) {
      try {
        setSubmitting(true);
        const res = await buyShopItem(fetcher, item.id);
        if (res?.data) syncFromPayload(res.data);
        if (typeof refetchUser === "function") refetchUser();
        showNotification(`Mua thành công "${item.name}"!`, "success");
        setSelectedItem(null);
      } catch (err) {
        showNotification(err?.message || "Không thể mua vật phẩm", "error");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const balance = item.currency === "SPARK" ? spark : crystal;
    if (balance < item.price) {
      showNotification(
        `Không đủ ${item.currency === "SPARK" ? "Spark" : "Crystal"}!`,
        "error"
      );
      return;
    }

    if (item.currency === "SPARK") {
      setSpark((prev) => prev - item.price);
    } else {
      setCrystal((prev) => prev - item.price);
    }

    const nextItems = items.map((i) =>
      i.id === item.id ? { ...i, owned: true } : i
    );
    setItems(nextItems);

    if (!item.consumable) {
      const nextMap = { ...equipped, [item.category]: item.id };
      setEquipped(nextMap);
      syncCosmeticsStorage(nextItems, nextMap);
    }

    showNotification(`Mua thành công "${item.name}"!`, "success");
    setSelectedItem(null);
  };

  const handleResetEquip = async () => {
    const emptyMap = {
      AVATAR_DECO: null,
      BANNER: null,
      PROFILE_EFFECT: null,
      NAMEPLATE: null,
    };
    if (usingApi) {
      for (const cat of Object.keys(equipped)) {
        const eqId = equipped[cat];
        if (eqId) {
          const item = items.find((i) => i.id === eqId);
          if (item) await toggleEquipShopItem(fetcher, item.id).catch(() => {});
        }
      }
      const res = await getShopOverview(fetcher).catch(() => null);
      if (res?.data) syncFromPayload(res.data);
    } else {
      setEquipped(emptyMap);
      syncCosmeticsStorage(items, emptyMap);
    }
    showNotification("Đã đặt lại trang bị về mặc định", "info");
  };

  const renderItemPreview = (item) => {
    if (item.category === "AVATAR_DECO") {
      return (
        <div className={c("avatarStage")}>
          <div className={c("avatarCore")}>{avatarInitial}</div>
          <div className={c("decoRing", item.decoClass)} />
        </div>
      );
    }
    if (item.category === "BANNER") {
      return (
        <div
          className={c("bannerThumb", item.bannerClass)}
          style={
            !styles[item.bannerClass] && BANNER_STYLES[item.assetKey]
              ? { background: BANNER_STYLES[item.assetKey] }
              : undefined
          }
        />
      );
    }
    if (item.category === "PROFILE_EFFECT") {
      return (
        <div className={c("effectThumb", item.previewClass)}>
          <Sparkles size={22} />
        </div>
      );
    }
    if (item.category === "NAMEPLATE") {
      return (
        <div className={c("nameplateThumb", item.nameClass)}>
          {displayName}
        </div>
      );
    }
    return (
      <div className={c("powerupThumb")}>
        {item.powerupIcon === "shield" ? (
          <ShieldCheck size={28} />
        ) : (
          <Zap size={28} />
        )}
      </div>
    );
  };

  return (
    <div className={c("shopPage")}>
      {/* Top Bar */}
      <div className={c("topBar")}>
        <div>
          <h1 className={c("pageTitle")}>
            <ShoppingBag size={22} />
            Cửa hàng Bunary
          </h1>
          <p className={c("pageSubtitle")}>
            Trang trí hồ sơ và mở khóa vật phẩm hỗ trợ học tập bằng Spark hoặc Crystal.
          </p>
        </div>

        <div className={c("walletGroup")}>
          <div className={c("balancePill", "sparkPill")} title="Số dư Spark">
            <Zap size={15} />
            <span>{spark.toLocaleString("en-US")}</span>
            <small>Spark</small>
          </div>
          <div className={c("balancePill", "crystalPill")} title="Số dư Crystal">
            <Gem size={15} />
            <span>{crystal.toLocaleString("en-US")}</span>
            <small>Crystal</small>
          </div>
          <Link to="/store" className={c("topupBtn")} title="Nạp thêm Crystal">
            <Plus size={14} />
            Nạp Crystal
          </Link>
          <button
            type="button"
            className={c("inventoryBtn", { active: inventoryOnly })}
            onClick={() => setInventoryOnly((prev) => !prev)}
          >
            <Package size={15} />
            Kho đồ ({ownedCount})
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className={c("layoutGrid")}>
        <div className={c("catalogCol")}>
          {/* Clean Featured Banner */}
          <div className={c("heroBanner")}>
            <div className={c("heroContent")}>
              <span className={c("heroTag")}>Bộ sưu tập nổi bật</span>
              <h2 className={c("heroTitle")}>Cá nhân hóa thẻ hồ sơ của bạn</h2>
              <p className={c("heroDesc")}>
                Hoàn thành nhiệm vụ hằng ngày để nhận Spark miễn phí, hoặc dùng Crystal mở khóa khung động và banner giới hạn.
              </p>
            </div>
            <div className={c("heroPreviewGroup")}>
              <div className={c("heroCircle")}>
                <span>{avatarInitial}</span>
                <div className={c("decoRing", "decoPrism")} />
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className={c("filterSection")}>
            <div className={c("categoryTabs")}>
              {SHOP_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={c("tabBtn", { active: activeCategory === cat.id })}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className={c("filterControls")}>
              <div className={c("currencyTabs")}>
                {CURRENCY_FILTERS.map((cf) => (
                  <button
                    key={cf.id}
                    type="button"
                    className={c("currencyBtn", {
                      active: currencyFilter === cf.id,
                    })}
                    onClick={() => setCurrencyFilter(cf.id)}
                  >
                    {cf.label}
                  </button>
                ))}
              </div>

              <div className={c("searchBox")}>
                <Search size={15} className={c("searchIcon")} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm vật phẩm..."
                  className={c("searchInput")}
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className={c("gridHeader")}>
            <h3 className={c("gridTitle")}>
              {inventoryOnly ? "Kho đồ của bạn" : "Danh sách vật phẩm"}
            </h3>
            <span className={c("gridCount")}>{filteredItems.length} mục</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className={c("emptyState")}>
              Không tìm thấy vật phẩm phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className={c("itemsGrid")}>
              {filteredItems.map((item) => {
                const isEq = equipped[item.category] === item.id;
                const rarity = RARITY_META[item.rarity] || RARITY_META.COMMON;
                const isSpark = item.currency === "SPARK";

                return (
                  <div
                    key={item.id}
                    className={c("itemCard", { equipped: isEq })}
                    onClick={() => setSelectedItem(item)}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className={c("cardVisual")}>
                      <span className={c("rarityBadge", rarity.className)}>
                        {rarity.label}
                      </span>
                      {item.owned && (
                        <span className={c("ownedBadge")}>Đã sở hữu</span>
                      )}
                      {renderItemPreview(item)}
                    </div>

                    <div className={c("cardBody")}>
                      <span className={c("cardCat")}>{item.catLabel}</span>
                      <h4 className={c("cardName")}>{item.name}</h4>
                      <p className={c("cardDesc")}>{item.desc}</p>

                      <div className={c("cardFooter")}>
                        <span
                          className={c("priceTag", {
                            sparkPrice: isSpark,
                            crystalPrice: !isSpark,
                          })}
                        >
                          {isSpark ? <Zap size={14} /> : <Gem size={14} />}
                          {item.price.toLocaleString("en-US")}
                        </span>

                        {item.owned ? (
                          item.consumable ? (
                            <button
                              type="button"
                              className={c("cardBtn", "btnSecondary")}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUsePowerup(item);
                              }}
                            >
                              Sử dụng
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={c("cardBtn", isEq ? "btnEquipped" : "btnSecondary")}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleEquip(item);
                              }}
                            >
                              {isEq ? (
                                <>
                                  <Check size={13} /> Đang dùng
                                </>
                              ) : (
                                "Trang bị"
                              )}
                            </button>
                          )
                        ) : (
                          <button
                            type="button"
                            className={c("cardBtn", "btnPrimary")}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                          >
                            Xem &amp; Mua
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky Live Profile Preview */}
        <aside className={c("previewCol")}>
          <div className={c("previewPanel")}>
            <div className={c("previewHeader")}>
              <span>Xem trước hồ sơ</span>
              <button
                type="button"
                className={c("resetBtn")}
                onClick={handleResetEquip}
                title="Đặt lại trang bị"
              >
                <RotateCcw size={13} />
                Đặt lại
              </button>
            </div>

            <div className={c("miniProfileCard")}>
              {activeEffect && (
                <div
                  className={c("profileEffectOverlay")}
                  style={{ background: activeEffect.effectStyle }}
                />
              )}

              <div
                className={c(
                  "miniBanner",
                  activeBanner ? activeBanner.bannerClass : ""
                )}
              />

              <div className={c("miniCardContent")}>
                <div className={c("miniAvatarRow")}>
                  <div className={c("miniAvatarWrap")}>
                    <div className={c("miniAvatarCore")}>{avatarInitial}</div>
                    {activeDeco && (
                      <div className={c("decoRing", activeDeco.decoClass)} />
                    )}
                    <span className={c("miniStatus")} />
                  </div>
                </div>

                <div className={c("miniInfoBox")}>
                  <div
                    className={c("miniName")}
                    style={
                      activeNameplate
                        ? { color: activeNameplate.nameColor }
                        : undefined
                    }
                  >
                    {displayName}
                  </div>
                  <div className={c("miniUsername")}>@{displayUsername}</div>
                  <div className={c("miniStatsRow")}>
                    <span>
                      <Flame size={13} className={c("flameIcon")} /> 14d Streak
                    </span>
                    <span>
                      <Zap size={13} className={c("zapIcon")} /> 1,240 XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={c("equippedSummary")}>
              <div className={c("eqRow")}>
                <span>Khung Avatar</span>
                <strong>{activeDeco ? activeDeco.name : "Mặc định"}</strong>
              </div>
              <div className={c("eqRow")}>
                <span>Banner</span>
                <strong>{activeBanner ? activeBanner.name : "Mặc định"}</strong>
              </div>
              <div className={c("eqRow")}>
                <span>Hiệu ứng</span>
                <strong>{activeEffect ? activeEffect.name : "Không có"}</strong>
              </div>
              <div className={c("eqRow")}>
                <span>Thẻ tên</span>
                <strong>
                  {activeNameplate ? activeNameplate.name : "Mặc định"}
                </strong>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Detail & Purchase Modal */}
      {selectedItem && (
        <div
          className={c("modalOverlay")}
          onClick={() => setSelectedItem(null)}
        >
          <div className={c("modalBox")} onClick={(e) => e.stopPropagation()}>
            <div className={c("modalPreview")}>
              <button
                type="button"
                className={c("modalClose")}
                onClick={() => setSelectedItem(null)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
              {renderItemPreview(selectedItem)}
            </div>

            <div className={c("modalBody")}>
              <div className={c("modalMeta")}>
                <span
                  className={c(
                    "rarityBadge",
                    "staticBadge",
                    (RARITY_META[selectedItem.rarity] || RARITY_META.COMMON)
                      .className
                  )}
                >
                  {(RARITY_META[selectedItem.rarity] || RARITY_META.COMMON).label}
                </span>
                <span className={c("cardCat")}>{selectedItem.catLabel}</span>
              </div>

              <h3 className={c("modalTitle")}>{selectedItem.name}</h3>
              <p className={c("modalDesc")}>{selectedItem.desc}</p>

              <div className={c("modalActions")}>
                <div
                  className={c("modalPrice", {
                    sparkPrice: selectedItem.currency === "SPARK",
                    crystalPrice: selectedItem.currency !== "SPARK",
                  })}
                >
                  {selectedItem.currency === "SPARK" ? (
                    <Zap size={17} />
                  ) : (
                    <Gem size={17} />
                  )}
                  <span>
                    {selectedItem.price.toLocaleString("en-US")}{" "}
                    {selectedItem.currency === "SPARK" ? "Spark" : "Crystal"}
                  </span>
                </div>

                {selectedItem.owned ? (
                  selectedItem.consumable ? (
                    <button
                      type="button"
                      className={c("modalActionBtn")}
                      disabled={submitting}
                      onClick={() => handleUsePowerup(selectedItem)}
                    >
                      Sử dụng ngay
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={c("modalActionBtn")}
                      disabled={submitting}
                      onClick={() => {
                        handleToggleEquip(selectedItem);
                        setSelectedItem(null);
                      }}
                    >
                      {equipped[selectedItem.category] === selectedItem.id
                        ? "Tháo trang bị"
                        : "Trang bị ngay"}
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    className={c("modalActionBtn")}
                    disabled={submitting}
                    onClick={() => handleBuy(selectedItem)}
                  >
                    {submitting ? "Đang xử lý..." : "Mua vật phẩm"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;
