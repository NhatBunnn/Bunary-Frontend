import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './MenuItem.module.css';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const c = classNames.bind(styles);

function MenuItem({ icon, label, to, collapsed, onClick }) {
  return (
    <Link
      onClick={onClick}
      to={to}
      className={c('menuItem', 'd-flex', 'align-items-center', 'link-no-style')}
    >
      <div className={c('content', 'd-flex', 'align-items-center')}>
        <div className={c('icon')}>
          <FontAwesomeIcon icon={icon} />
        </div>
        {!collapsed && <div className={c('label', 'ms-3')}>{label}</div>}
      </div>
    </Link>
  );
}

export default MenuItem;
