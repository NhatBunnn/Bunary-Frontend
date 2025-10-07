// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import styles from "./CreateWordSet.module.css";
// import classNames from "classnames/bind";
// import { faGear } from "@fortawesome/free-solid-svg-icons";
// import { faImage } from "@fortawesome/free-regular-svg-icons";
// import TitleSection from "../../components/TitleSection";
// import Button from "../../components/Button";
// import useCreateWordSet from "../../hooks/useCreateWordSet";
// import ValidateInput from "../../components/ValidateInput";
// import WordCardCreate from "./components/WordCardCreate";
// import { useNotification } from "../../context/NotificationProvider";

import { WordSetForm } from "@features/wordsets/components";
import { Fragment } from "react";

// const c = classNames.bind(styles);

// function CreateWordSet() {
//   const { showNotification } = useNotification();

//   const {
//     fieldErrors,
//     title,
//     setTitle,
//     description,
//     setDescription,
//     setThumbnailFile,
//     handleSaveWordSet,
//     wordCards,
//     setWordCards,
//     loading,
//   } = useCreateWordSet();

//   const addWordCard = () => {
//     setWordCards((prev) => [
//       ...prev,
//       { term: "", ipa: "", partOfSpeech: "", meaning: "", thumbnail: null },
//     ]);
//   };

//   const removeWordCard = (index) => {
//     if (wordCards.length <= 1) {
//       return showNotification(
//         "Không thể xóa, mỗi bộ phải có ít nhất 1 thẻ",
//         "error"
//       );
//     }

//     setWordCards((prev) =>
//       prev.filter((_, i) => {
//         return i !== index;
//       })
//     );
//   };

//   const handleChange = (index, field, value) => {
//     const newWordCards = [...wordCards];
//     newWordCards[index][field] = value;
//     setWordCards(newWordCards);
//   };

//   return (
//     <div className={c("createWordSet")}>
//       {/* Title */}
//       <TitleSection title="Tạo bộ từ vựng mới" onTop={true}>
//         <Button
//           label="Thêm"
//           onClick={() => handleSaveWordSet()}
//           isLoading={loading}
//         />
//         <Button label="Sửa" />
//       </TitleSection>
//       {/* Input */}
//       <div
//         className={c(
//           "wordset-input",
//           "d-flex",
//           "align-items-center",
//           "justify-content-between",
//           "mb-3"
//         )}
//       >
//         <div
//           className={c(
//             "text-input",
//             "d-flex",
//             "flex-column",
//             "w-100",
//             "me-4",
//             "h-100"
//           )}
//         >
//           <ValidateInput
//             field="title"
//             fieldErrors={fieldErrors}
//             value={title}
//             onChange={setTitle}
//             placeholder="   Tiêu đề"
//             className={c("name", "mb-4", "outline-prmary")}
//           />
//           <input
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="   Mô tả"
//             className={c("desc", "outline-primary")}
//           />
//         </div>
//         <div
//           className={c(
//             "image",
//             "d-flex",
//             "align-items-center",
//             "justify-content-center"
//           )}
//         >
//           <input
//             accept="image/*"
//             type="file"
//             onChange={(e) => setThumbnailFile(e.target.files[0])}
//           />
//           <FontAwesomeIcon icon={faImage} size="2x" />
//         </div>
//       </div>
//       {/* Toolbar */}
//       <div
//         className={c("toolbar", "d-flex", "justify-content-between", "mb-4")}
//       >
//         <div className={c("button")}>
//           <Button type="submit" label="Thêm nhiều từ" />
//           <Button label="Sửa chính tả" />
//         </div>
//         <div className={c("setting")}>
//           <Button icon={faGear} />
//         </div>
//       </div>
//       {/* wordcarslist */}
//       <div className={c("wordcarslist")}>
//         {wordCards.map((wordCard, i) => {
//           return (
//             <div key={i}>
//               <WordCardCreate
//                 index={i}
//                 term={wordCard.term}
//                 ipa={wordCard.ipa}
//                 type={wordCard.type}
//                 thumb={wordCard.thumbnail}
//                 meaning={wordCard.meaning}
//                 onChange={handleChange}
//                 onRemove={removeWordCard}
//               />
//             </div>
//           );
//         })}
//       </div>
//       {/* btn-newcard */}
//       <div className={c("btn-new-card")}>
//         <FontAwesomeIcon icon={faGear} />
//       </div>
//       <Button label="Thêm thẻ" onClick={addWordCard} />
//     </div>
//   );
// }

// export default CreateWordSet;

function CreateWordSet() {
  return (
    <Fragment>
      <WordSetForm />
    </Fragment>
  );
}

export default CreateWordSet;
