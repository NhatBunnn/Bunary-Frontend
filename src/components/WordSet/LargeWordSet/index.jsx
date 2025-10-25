import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Image, Images } from '../../../assets/images';
import styles from './LargeWordSet.module.css';
import classNames from 'classnames/bind';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const c = classNames.bind(styles);

function LargeWordSet({ author, wordSet }) {
  return (
    <Link
      className={c('largeWordSet', 'd-flex', 'justify-content-left', 'link-no-style')}
      to={`/wordset/${wordSet?.id}/${wordSet?.title
        .split(' ')
        .filter(Boolean)
        .map((d) => d.toLowerCase())
        .join('-')}`}
    >
      <div className={c('thumbnail')}>
        <div className={c('rating')}>
          <FontAwesomeIcon icon={faStar} className={c('rating__icon')} />
          <span>9.7</span>
        </div>
        <img src={wordSet?.thumbnail} alt="" />
      </div>
      <div className={c('content', 'd-flex', 'flex-column', 'justify-content-between')}>
        <div className={c('head')}>
          <div className={c('title')}>{wordSet?.title}</div>
          <div className={c('vocab')}>
            <span>147 từ vựng</span>
          </div>
        </div>
        <div className={c('description', 'h-100')}>{wordSet?.description}</div>
        <div className={c('author', 'd-flex', 'align-items-center')}>
          <Image src={author?.avatar || Images.Logo} size="24px" isCircled="true" />
          <span>{author?.fullName}</span>
        </div>
      </div>
    </Link>
  );
}

export default LargeWordSet;
