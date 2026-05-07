import { useState, useEffect, useRef } from "react";
import styles from "./Calander.module.css";
import { ChevronDown } from "lucide-react";

export function CustomDatePicker({ label, value, onChange }) {
  const today = new Date();
  const initial = value ? new Date(value) : today;

  const [day, setDay] = useState(initial.getDate());
  const [month, setMonth] = useState(initial.getMonth() + 1);
  const [year, setYear] = useState(initial.getFullYear());

  const [isDayOpen, setIsDayOpen] = useState(false);
  const dayRef = useRef(null);

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const monthRef = useRef(null);

  const daysInMonth = new Date(year, month, 0).getDate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dayRef.current && !dayRef.current.contains(event.target)) {
        setIsDayOpen(false);
      }
      if (monthRef.current && !monthRef.current.contains(event.target)) {
        setIsMonthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    onChange?.(date);
  }, [day, month, year]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.pickerContainer}>
        <label className={styles.inputLabel}>{label}</label>

        <div className={styles.customSelect} ref={dayRef}>
          <div
            className={`${styles.selectHeader} ${
              isDayOpen ? styles.active : ""
            }`}
            onClick={() => {
              setIsDayOpen(!isDayOpen);
              setIsMonthOpen(false);
            }}
          >
            <span>{day}</span>
            <ChevronDown size={14} className={isDayOpen ? styles.rotate : ""} />
          </div>

          {isDayOpen && (
            <div className={styles.optionsList}>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <div
                  key={d}
                  className={`${styles.optionItem} ${
                    day === d ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setDay(d);
                    setIsDayOpen(false);
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.customSelect} ref={monthRef}>
          <div
            className={`${styles.selectHeader} ${
              isMonthOpen ? styles.active : ""
            }`}
            onClick={() => {
              setIsMonthOpen(!isMonthOpen);
              setIsDayOpen(false); // Đóng day nếu đang mở
            }}
          >
            <span>{month}</span>
            <ChevronDown
              size={14}
              className={isMonthOpen ? styles.rotate : ""}
            />
          </div>

          {isMonthOpen && (
            <div className={styles.optionsList}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <div
                  key={m}
                  className={`${styles.optionItem} ${
                    month === m ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setMonth(m);
                    setIsMonthOpen(false);
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* YEAR INPUT */}
        <input
          className={styles.yearInput}
          type="number"
          min="1900"
          max={today.getFullYear() + 10}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
