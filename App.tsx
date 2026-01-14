/* نظام التفاعل اللمسي الأحمر (Red Crystal Ripple) */
@keyframes crystal-ripple {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
    border-width: 6px;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
    border-width: 1px;
  }
}

.ripple-effect {
  position: absolute;
  border-style: solid;
  border-color: rgba(239, 68, 68, 0.4); /* اللون الأحمر الرسمي للتموج */
  border-radius: 50%;
  pointer-events: none;
  z-index: 50;
  animation: crystal-ripple 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.custom-cursor {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: width 0.3s, height 0.3s, background-color 0.3s;
}
