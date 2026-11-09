/**
 * EFIPS Orison Library — conservative first batch, 9 November 2026.
 * Source: books .xlsx, partial export of 2,028 physical-copy records.
 * Each line is shelf | ISBN | comma-separated accession barcodes | title | author.
 * Only clear single-shelf categories 22 (Disney), 23 (animals), 24 (science),
 * and 26 (foreign languages/puzzles/music) have been selected for this batch.
 *
 * ISBN check digits passed arithmetic validation; this does not prove that the
 * printed edition matches Orison's bibliographic entry.
 * No true physical row was supplied. Existing records are never overwritten.
 * These are catalog data, not user-generated instructions.
 */
export type OrisonCuratedRecord = {
  shelf: number;
  isbn: string;
  barcodes: string[];
  title: string;
  author: string;
};
const sourceLines = `22|9780717284832|00038933,00037058|101 Dalmatians|Walt Disney
22|0590544284|00024009|Abu Monkeys Around : A Story From Disneys Aladdin|Anne Schreiber
22|9780717283378|00039235,00024230|Aladdin|Walt Disney Company
22|9780394857626|00035750|Aladdin And The Dancing Princess|Walt Disney
22|9781579730130|00034869|Alice In Wonderland|Disney Enterprises Inc
22|9780763401955|00022018|A New Hope Read-Along|Walt Disney Productions
22|9780553055061|00036694,00027383|Animals And Their Babies|Walt Disney Productions
22|1412730775|00038932|Ariel : The Friendly Sea|Disney
22|9780307155092|00024411|A Treasury Of Disney Little Golden Books|Walt Disney
23|9780486291727|00033817|101 Questions About Dinosaurs|Philip J. Currie
23|9780809243020|00031241|10 Things I Know About Elephants|Wendy Wax
23|9780590638821|00033971|A Dolphin Is Not A Fish|Betsey Chessen And Pamela Chanko
23|1581960166|00034914|Albino Animals|Kelly Milner Halls
23|0899431119|00034386,00034087|All About Dogs|Wendy Boorer
23|9780448418414|00034506|All About Dogs And Puppies|Laura Driscoll
23|9780590481465|00031851|All About Lizards|Jim Arnosky
23|9780590467919|00031155|All About Owls|Jim Arnosky
23|9780590467957|00031587|All About Rattlesnakes|Jim Arnosky
23|9780590697811|00031602,00034593,00031606|All About Turtles|Jim Arnosky
23|9781555216160|00031730|All Color Book Of Horses|Elizabeth Johnson
23|9780545003490|00031353|Amazing Sharks|Sarah L. Thomson
23|9780060544560|00031378|Amazing Sharks!|Sarah L. Thomson
23|9780816717521|00031320|Amazing World Of Spiders|Janet Palazzo-Craig
23|9780394835709|00034050|Animal Babies|Harry McNaught
23|9780590761666|00034033|Animal Homes|Betsey Chessen
23|9780153653346|00031337|Animal Homes, Above-Level Reader Grade K|Ann Lee
23|9780590403474|00034598|Animals A To Z.|David M. McPhail
23|9780865927797|00031774|Animals In Danger|Gill Gould
23|9780673625069|00031640|Animals In The City|Barbara Reeves
23|0064451658|00031118|Animals In Winter|Henrietta Bancroft and Richard G. Van Gelder
23|0394822617|00034577|Animals Keeping Clean|Jane Burton
23|0816721440|00031148|A Picture Book Of Arctic Animals|Kellie Conforth
23|9780816719013|00031466,00033881|A Picture Book Of Dinosaurs|Claire Nemes
23|9780816719037|00031427|A Picture Book Of Dogs|Joanne Gise
23|9780140386929|00034891|A Polar Bear Can Swim|Harriet Ziefert
23|9780590431019|00037945|A Sea Full Of Sharks|Betsy Maestro
23|0876668104|00030503|Atlas Of Marine Mammals|V.A. Arseniev
23|0803713827|00031209|A World Without Elephants?|Joan Bowden
23|9781550746792|00031093|Beavers|Deborah Hodge
24|9781565653634|00030507|50 Nifty Super Science Fair Projects|Jill Smolinski
24|9780590410991|00031632|A Day In Space|Suzanne Lord
24|1569118612|00028260|Adding & Subtracting Fractions With Like Denominators|Barbara Bando Irvin
24|0938256327|00028235,00028239|Advanced Addition & Subtraction : Grades 4-5|Martha Palmer
24|9780590480772|00031369,00031073|All About Electricity|Melvin Berger
24|9780893759704|00031071|All About Mountains & Volcanoes|Elizabeth Marcus
26|1900465884|00039798|1000 First Words In French|Nicola Baxter and Guillaume Dopffer
26|9780590998185|00039181|101 Bug Jokes|Lisa And Katy Hall Eisenberg
26|9780590433365|00028634|101 Cat And Dog Jokes|Katy Hall
26|9780590437592|00028849|101 School Cafeteria Jokes|Jovial Bob Stine
26|9780590411820|00028848,00028847,00028486,00028626|101 School Jokes|Lisa Eisenberg
26|9781565651081|00038802|50 Nifty Travel Games|Kevin Taylor
26|0806947268|00032183|696 Silly School Jokes & Riddles|Joseph Rosenbloom
26|9780882847887|00033972|Alfreds Basic Piano Course Lesson Book, Bk 1A|Willard A. Palmer; Morton Manus; Amanda Vick Lethco
26|0395788730|00039875|Arañas|Gail Gibbons
26|3473338486|00040062|Auf Dem Markt|Ursel Scheffler
26|0590735187|00040025|À Lécole, Nathan!|Lulu Delacre`;
export const orisonCuratedRecords: OrisonCuratedRecord[] = sourceLines
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map(line => {
    const [shelf, isbn, barcodes, title, author] = line.split('|');
    return {
      shelf: Number(shelf),
      isbn: isbn.trim(),
      barcodes: barcodes.split(',').map(x => x.trim()).filter(Boolean),
      title: title.trim(),
      author: author.trim()
    };
  });
