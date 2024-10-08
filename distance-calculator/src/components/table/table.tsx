import React, { useEffect, useRef, useState } from 'react';
import transformKmhToDistance from '../../common/calculate-distance';
import styles from './table.module.scss';
import saveIcon from '../../assets/save-icon.png';
import saveIconDark from '../../assets/save-icon-dark.png';
import exitIcon from '../../assets/exit-icon.png';
import deleteIcon from '../../assets/delete-icon.png';
import deleteIconDark from '../../assets/delete-icon-dark.png';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectIsMetric,
  selectIsTable,
  setIsTable,
} from '../../store/reducers/user-settings-slice';
import tableText from './lang-data';
import {
  selectLanguage,
  selectTheme,
} from '../../store/reducers/app-settings-slice';

const Table = () => {
  const isMetric = useAppSelector(selectIsMetric);
  const isTable = useAppSelector(selectIsTable);
  const lang = useAppSelector(selectLanguage);
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  let localTimeArr = [0.5, 1, 2];
  let localSpeedArr = [
    40, 50, 60, 80, 90, 100, 120, 130, 140, 150, 160, 180, 200, 299,
  ];

  if (localStorage.getItem('timeArr'))
    localTimeArr = JSON.parse(localStorage.getItem('timeArr') as string);

  if (localStorage.getItem('speedArr'))
    localSpeedArr = JSON.parse(localStorage.getItem('speedArr') as string);

  const [editionMode, setEditionMode] = useState<'time' | 'speed' | null>(null);
  const [time, setTime] = useState<number[]>(localTimeArr);
  const [speed, setSpeed] = useState<number[]>(localSpeedArr);

  const tableRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (tableRef && tableRef.current) {
      const table = tableRef.current as HTMLElement;

      table.style.gridTemplateColumns = `${'1.2fr'.concat(
        ' 1fr'.repeat(time.length)
      )}`;
    }
  }, [tableRef, time, speed, isTable]);

  const editValues = (valuesArr: number[], input: HTMLInputElement) => {
    setEditionMode(time === valuesArr ? 'time' : 'speed');
    input.value = valuesArr.join(', ');
  };

  const saveValues = (input: HTMLInputElement) => {
    const arr = Array.from(
      new Set(
        input.value
          .replace(/[^0-9.,]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
          .map((el) => parseFloat(el.replace(',', '.')))
          .sort((a, b) => a - b)
      )
    ).filter((el) => el > 0);

    if (arr.length) {
      if (editionMode === 'time') {
        setTime(arr);
        localStorage.setItem('timeArr', JSON.stringify(arr));
      } else {
        setSpeed(arr);
        localStorage.setItem('speedArr', JSON.stringify(arr));
      }
    }

    setEditionMode(null);
    input.value = '';
  };

  const returnValues = (input: HTMLInputElement) => {
    setEditionMode(null);
    input.value = '';
  };

  const deleteValues = (input: HTMLInputElement) => {
    input.value = '';
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <p className={styles.label}>{tableText[lang].tableHeader}</p>
          <div
            className={
              editionMode ? styles.controllers : styles.controllers_inactive
            }
          >
            <input ref={inputRef} className={styles.input}></input>
            <div className={styles.buttonBlock}>
              <img
                className={styles.saveButton}
                onClick={() => {
                  if (inputRef.current) saveValues(inputRef.current);
                }}
                src={theme === 'light' ? saveIcon : saveIconDark}
              />
              <img
                className={styles.saveButton}
                onClick={() => {
                  if (inputRef.current) deleteValues(inputRef.current);
                }}
                src={theme === 'light' ? deleteIcon : deleteIconDark}
              />
              <img
                className={styles.saveButton}
                onClick={() => {
                  if (inputRef.current) returnValues(inputRef.current);
                }}
                src={exitIcon}
              />
            </div>
          </div>
          <div className={styles.tableBlock}>
            <div className={styles.table} ref={tableRef}>
              <p className={styles.cell}></p>
              {time.map((timeEl) => (
                <p
                  key={timeEl}
                  className={`${styles.cell} ${styles.cell_time}`}
                  onClick={() => {
                    if (!editionMode && inputRef.current)
                      editValues(time, inputRef.current);
                  }}
                >
                  {timeEl.toString().concat(` ${tableText[lang].time}`)}
                </p>
              ))}
              {speed.map((speedEl) => (
                <React.Fragment key={speedEl}>
                  <p
                    className={`${styles.cell} ${styles.cell_speed}`}
                    onClick={() => {
                      if (!editionMode && inputRef.current)
                        editValues(speed, inputRef.current);
                    }}
                  >
                    {isMetric
                      ? speedEl
                          .toString()
                          .concat(` ${tableText[lang].speed.labelForMetric}`)
                      : speedEl
                          .toString()
                          .concat(` ${tableText[lang].speed.labelForImperial}`)}
                  </p>
                  {time.map((timeEl) => (
                    <p key={speedEl + '/' + timeEl} className={styles.cell}>
                      {transformKmhToDistance(speedEl, timeEl, isMetric).concat(
                        ` ${tableText[lang].distance}`
                      )}
                    </p>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <p
            className={styles.button}
            onClick={() => {
              dispatch(setIsTable(false));
              setEditionMode(null);
            }}
          >
            {tableText[lang].calculator}
          </p>
        </div>
      </div>
    </>
  );
};

export default Table;
