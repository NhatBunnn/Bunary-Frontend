import { createContext, useContext, useState } from 'react';
import styles from './WordSetSlider.module.css';
import classNames from 'classnames/bind';
import Loading from '@components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import WordSet from '../WordSet/WordSet';

const c = classNames.bind(styles);

export const wordSetValueContext = createContext();

function WordSetSlider({ className, wordSets }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!wordSets) return <Loading />;

  const handleSlide = (direction) => {
    const total = Math.ceil(wordSets.length / 3);
    if (direction === 'prev') {
      currentSlide !== total && setCurrentSlide((prev) => prev - 1);
    } else {
      currentSlide + 1 >= total ? setCurrentSlide(0) : setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <div className={c('wordSetSlider', 'd-flex', className)}>
      <div className={c('slider-container')}>
        <div className={c('btn-leftArrow')} onClick={() => handleSlide('prev')}>
          <FontAwesomeIcon icon={faAngleLeft} size="lg" />
        </div>
        <div className={c('btn-rightArrow')} onClick={() => handleSlide('next')}>
          <FontAwesomeIcon icon={faAngleRight} size="lg" />
        </div>
        <div
          className={c('slider-track')}
          style={{
            transform: `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 30}px))`,
            transition: 'transform 0.5s ease',
          }}
        >
          {wordSets?.map((d, i) => {
            return (
              <div className={c('slider')} key={i}>
                <WordSet size="large" author={d?.author} wordSet={d} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WordSetSlider;
