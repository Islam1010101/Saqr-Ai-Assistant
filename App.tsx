/* 1. نظام التفاعل اللمسي الأحمر الكريستالي (Refined Crystal Ripple) */
@keyframes crystal-ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
    border-width: 8px;
    filter: blur(0px);
  }
  100% {
    transform: translate(-50%, -50%) scale(4.5);
    opacity: 0;
    border-width: 1px;
    filter: blur(2px); /* تأثير التلاشي الضبابي */
  }
}

.ripple-effect {
  position: absolute;
  border-style: solid;
  border-color: rgba(239, 68, 68, 0.5); /* اللون الأحمر الرسمي المطور */
  border-radius: 50%;
  pointer-events: none;
  z-index: 99;
  animation: crystal-ripple 0.9s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.2); /* هالة ضوئية حول التموج */
}

/* 2. المؤشر المخصص (Enhanced Custom Cursor) */
.custom-cursor {
  position: fixed;
  width: 32px;
  height: 32px;
  background-color: rgba(239, 68, 68, 0.1); /* خلفية حمراء باهتة */
  border: 2px solid rgba(239, 68, 68, 0.4); /* إطار أحمر كريستالي */
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  transition: transform 0.15s ease-out, width 0.3s, height 0.3s, background-color 0.3s;
  backdrop-filter: blur(2px); /* تأثير زجاجي للمؤشر نفسه */
}

/* تأثير إضافي عند تمرير المؤشر فوق العناصر القابلة للتفاعل */
.custom-cursor-hover {
  transform: translate(-50%, -50%) scale(1.5);
  background-color: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.6);
}
