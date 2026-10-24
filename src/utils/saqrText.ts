/**
 * Presentation-only response hygiene. Never modifies user input, catalog records,
 * lesson/certificate metadata, or Saqr's actual conversation instructions.
 */
export const stripSaqrEmoji = (answer: string): string => String(answer || '')
  .replace(/(?:[0-9#*]\uFE0F?\u20E3|\p{Regional_Indicator}{2}|\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier}|\u200D\p{Extended_Pictographic})*)/gu, '')
  .replace(/[\uFE0E\uFE0F\u200D\u20E3]/g, '');
