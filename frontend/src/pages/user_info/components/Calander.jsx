<<<<<<< HEAD
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
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange?.(date);
  }, [day, month, year]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.pickerContainer}>
        <label className={styles.inputLabel}>{label}</label>

        <div className={styles.customSelect} ref={dayRef}>
          <div
            className={`${styles.selectHeader} ${isDayOpen ? styles.active : ""}`}
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
                  className={`${styles.optionItem} ${day === d ? styles.selected : ""}`}
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
            className={`${styles.selectHeader} ${isMonthOpen ? styles.active : ""}`}
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
                  className={`${styles.optionItem} ${month === m ? styles.selected : ""}`}
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
=======
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Calander.module.css";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function CustomDatePicker({ label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [direction, setDirection] = useState(0); // -1 cho tháng trước, 1 cho tháng sau

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setDirection(-1); // Đặt hướng lướt sang phải
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setDirection(1); // Đặt hướng lướt sang trái
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
  };

  const onDateClick = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newDate);
    setIsOpen(false);
  };

  const formatDateDisplay = (date) => {
    return `${monthNames[date.getMonth()]}, ${String(date.getDate()).padStart(2, "0")} ${date.getFullYear()}`;
  };

  // Variants cho hiệu ứng lướt tháng
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const renderDays = () => {
    const days = [];
    for (
      let i = 0;
      i < firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
      i++
    ) {
      days.push(<div key={`empty-${i}`} className={styles.emptyCell}></div>);
    }
    for (
      let d = 1;
      d <= daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
      d++
    ) {
      const isSelected =
        d === selectedDate.getDate() &&
        viewDate.getMonth() === selectedDate.getMonth() &&
        viewDate.getFullYear() === selectedDate.getFullYear();
      days.push(
        <div
          key={d}
          className={`${styles.dayCell} ${isSelected ? styles.selectedDay : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onDateClick(d);
          }}
        >
          {d}
        </div>,
      );
    }

    while (days.length < 42) {
      days.push(
        <div
          key={`empty-${days.length - 1}`}
          className={styles.emptyCell}
        ></div>,
      );
    }

    return days;
  };

  return (
    <div className={styles.customSelectWrapper}>
      <div
        className={styles.inputBoxContainer}
        onClick={() => setIsOpen(!isOpen)}
      >
        <label className={styles.inputLabel}>{label}</label>
        <div className={styles.selectTrigger}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Calendar size={20} color="#000085" />
            <span style={{ fontWeight: 600 }}>
              {formatDateDisplay(selectedDate)}
            </span>
          </div>
          {/* Hiệu ứng quay của ChevronDown */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={styles.chevronIcon}
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            layout
            className={styles.calendarPopup}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
                layout: { type: "linear", stiffness: 500, damping: 50 }, // Tùy chỉnh độ nảy khi co giãn
                opacity: { duration: 0.2 } 
            }}
          >
            {/* Header Tím Nhạt nhỏ hơn */}
            <div className={styles.calendarHeader}>
              <div className={styles.headerDateDisplay}>
                {formatDateDisplay(selectedDate)}
              </div>
            </div>

            <div className={styles.calendarBody}>
              <div className={styles.calendarNav}>
                <button className={styles.navBtn} onClick={handlePrevMonth}>
                  <ChevronLeft size={20} />
                </button>
                <span>
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button className={styles.navBtn} onClick={handleNextMonth}>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Lưới ngày với hiệu ứng lướt */}
              <div className={styles.gridContainer}>
                <div className={styles.weekdayRow}>
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className={styles.weekdayLabel}>
                      {d}
                    </div>
                  ))}
                </div>
                <div className={styles.daysWrapper}>
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="popLayout"
                  >
                    <motion.div
                      key={`${viewDate.getMonth()}-${viewDate.getFullYear()}`}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      className={styles.daysGrid}
                    >
                      {renderDays()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
>>>>>>> bb5a0c8 ([ADD] news page and link the news collection to navigate to it)
    </div>
  );
}
