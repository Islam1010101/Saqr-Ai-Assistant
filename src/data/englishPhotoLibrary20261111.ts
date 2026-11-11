/** The verified, consecutively numbered 2026-11-11 English image editions only.
 * No incomplete folders are listed or shown in the platform/Saqr catalogue.
 * Page images are loaded only by the reader after the student opens a title.
 */
import { EN_PHOTO_B01 } from './englishPhotoMeta/b01';
import { EN_PHOTO_B02 } from './englishPhotoMeta/b02';
import { EN_PHOTO_B03 } from './englishPhotoMeta/b03';
import { EN_PHOTO_B04 } from './englishPhotoMeta/b04';
import { EN_PHOTO_B05 } from './englishPhotoMeta/b05';
import { EN_PHOTO_B06 } from './englishPhotoMeta/b06';
import { EN_PHOTO_B07 } from './englishPhotoMeta/b07';
import { EN_PHOTO_B08 } from './englishPhotoMeta/b08';
import { EN_PHOTO_B09 } from './englishPhotoMeta/b09';

const AUTHOR_BY_TITLE:Readonly<Record<string,string>>={
  "Super Shark Encyclopedia": "DK",
  "Hamlet: The Manga Edition": "William Shakespeare; adapted by Adam Sexton",
  "Othello (Pocket Classics)": "William Shakespeare",
  "Understanding Comics": "Scott McCloud",
  "Nicholas Nickleby (Famous Authors Edition)": "Charles Dickens",
  "How to Draw Comics the Marvel Way": "Stan Lee and John Buscema",
  "Macbeth (Illustrated Classics)": "William Shakespeare",
  "DKfindout! Coding": "DK; James Floyd Kelly",
  "Dog Man: Twenty Thousand Fleas Under the Sea": "Dav Pilkey",
  "Dog Man: A Tale of Two Kitties": "Dav Pilkey",
  "Big Jim Believes": "Dav Pilkey",
  "Cat Kid Comic Club: Perspectives": "Dav Pilkey",
  "The 7 Habits of Happy Kids": "Sean Covey",
  "DK Children's Encyclopedia": "DK",
  "Dog Man: Sneak Peek at New Movie": "Dav Pilkey",
  "Cat Kid Comic Club": "Dav Pilkey",
  "Cat Kid Comic Club: Collaborations": "Dav Pilkey",
  "As You Like It (Pocket Classics)": "William Shakespeare",
  "Artist's Painting Techniques": "DK",
  "1000 Inventions and Discoveries": "Roger Bridgman",
  "Gravity Falls: Lost Legends": "Alex Hirsch",
  "Wonder": "R. J. Palacio",
  "We Hunt the Flame": "Hafsah Faizal",
  "A Long Walk to Water": "Linda Sue Park",
  "The House on Mango Street": "Sandra Cisneros",
  "Fantastic Beasts and Where to Find Them": "J. K. Rowling",
  "The Hound of the Baskervilles": "Arthur Conan Doyle",
  "And Then There Were None": "Agatha Christie",
  "Tales of the Unexpected": "Roald Dahl",
  "How Much Land Does a Man Need?": "Leo Tolstoy",
  "The Great Gatsby": "F. Scott Fitzgerald",
  "The Tell-Tale Heart": "Edgar Allan Poe",
  "The Lion King": "Disney",
  "Brother Bear": "Disney",
  "Diary of a Wimpy Kid: The Third Wheel": "Jeff Kinney",
  "Diary of a Wimpy Kid: Rodrick Rules": "Jeff Kinney",
  "Diary of a Wimpy Kid: Hard Luck": "Jeff Kinney",
  "Diary of a Wimpy Kid: Cabin Fever": "Jeff Kinney",
  "Diary of a Wimpy Kid: Double Down": "Jeff Kinney",
  "What Is the Name of This Book?": "Raymond Smullyan",
  "Murdle": "G. T. Karber",
  "The 5 Second Rule": "Mel Robbins",
  "Atomic Habits": "James Clear",
  "How to Win Friends and Influence People": "Dale Carnegie"
};
const CHILDRENS_TITLES=new Set(['Super Shark Encyclopedia','The Magical Yet','The 7 Habits of Happy Kids','DK Children\'s Encyclopedia','Dog Man: Sneak Peek at New Movie','Barry\'s Buzzy World','The Sand Witch','The Lion King','Brother Bear']);
const ADULT_TITLES=new Set(['Understanding Comics','Artist\'s Painting Techniques','What Is the Name of This Book?','The 5 Second Rule','Atomic Habits','How to Win Friends and Influence People']);
const ALL_ENGLISH_PHOTO_BOOKS=[EN_PHOTO_B01,EN_PHOTO_B02,EN_PHOTO_B03,EN_PHOTO_B04,EN_PHOTO_B05,EN_PHOTO_B06,EN_PHOTO_B07,EN_PHOTO_B08,EN_PHOTO_B09].flat();
export const ENGLISH_PHOTO_LIBRARY_20261111=ALL_ENGLISH_PHOTO_BOOKS.map(b=>({
 ...b, author:AUTHOR_BY_TITLE[b.title]||b.author,
 readingAudience:CHILDRENS_TITLES.has(b.title)?'children':ADULT_TITLES.has(b.title)?'adults':b.readingAudience,
 // These are photo-page sources, not PDF files. Keep reading in the existing glass reader.
 requiresSchoolGoogleAccess:true,
}));
