import {
  App,
  Editor,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";

const insertName = (editor: Editor, name: string) => {
  const cursor = editor.getCursor();
  editor.replaceRange(name, cursor);
  editor.setCursor(cursor.line, cursor.ch + name.length);
};

type NameGeneratorSettings = {
  firstNames: string;
  maleFirstNames: string;
  femaleFirstNames: string;
  lastNames: string;
};

const DEFAULT_SETTINGS: NameGeneratorSettings = {
  firstNames: [
    "Anna",
    "Ben",
    "Clara",
    "David",
    "Elena",
    "Finn",
  ].join("\n"),
  maleFirstNames: [
    "Adolf",
    "Albert",
    "Alfred",
    "Artur",
    "Arthur",
    "August",
    "Bruno",
    "Carl",
    "Karl",
    "Curt",
    "Kurt",
    "Egon",
    "Emil",
    "Erich",
    "Ernst",
    "Erwin",
    "Franz",
    "Friedrich",
    "Fritz",
    "Georg",
    "Gerd",
    "Gert",
    "Gerhard",
    "Günter",
    "Günther",
    "Gustav",
    "Hans",
    "Harald",
    "Harry",
    "Harri",
    "Heinrich",
    "Heinz",
    "Helmut",
    "Helmuth",
    "Herbert",
    "Hermann",
    "Horst",
    "Johann",
    "Johannes",
    "Josef",
    "Joseph",
    "Klaus",
    "Claus",
    "Ludwig",
    "Max",
    "Oskar",
    "Oscar",
    "Otto",
    "Paul",
    "Richard",
    "Robert",
    "Rolf",
    "Rudolf",
    "Rudolph",
    "Walter",
    "Walther",
    "Werner",
    "Wilhelm",
    "Willi",
    "Willy",
    "Wolfgang",
  ].join("\n"),
  femaleFirstNames: [
    "Alma",
    "Anna",
    "Anneliese",
    "Annemarie",
    "Anni",
    "Annie",
    "Anny",
    "Auguste",
    "Berta",
    "Bertha",
    "Carla",
    "Karla",
    "Charlotte",
    "Clara",
    "Klara",
    "Dora",
    "Dorothea",
    "Edith",
    "Elfriede",
    "Elisabeth",
    "Elise",
    "Ella",
    "Elli",
    "Elly",
    "Else",
    "Emma",
    "Erika",
    "Erna",
    "Eva",
    "Frieda",
    "Frida",
    "Gerda",
    "Gertrud",
    "Gisela",
    "Hannelore",
    "Hedwig",
    "Helene",
    "Helga",
    "Hertha",
    "Herta",
    "Hildegard",
    "Ida",
    "Ilse",
    "Inge",
    "Ingeborg",
    "Ingrid",
    "Irma",
    "Irmgard",
    "Johanna",
    "Katharina",
    "Käthe",
    "Lieselotte",
    "Lisa",
    "Lotte",
    "Luise",
    "Louise",
    "Margarethe",
    "Margarete",
    "Margot",
    "Maria",
    "Marie",
    "Martha",
    "Marta",
    "Minna",
    "Olga",
    "Ruth",
    "Ursula",
    "Waltraud",
    "Wilhelmine",
  ].join("\n"),
  lastNames: [
    "Meyer",
    "Schmidt",
    "Wagner",
    "Becker",
    "Fischer",
    "Hoffmann",
  ].join("\n"),
};

const DE1920_MALE_FIRST_NAMES = [
  "Adolf",
  "Albert",
  "Alfred",
  "Artur",
  "Arthur",
  "August",
  "Bruno",
  "Carl",
  "Karl",
  "Curt",
  "Kurt",
  "Egon",
  "Emil",
  "Erich",
  "Ernst",
  "Erwin",
  "Franz",
  "Friedrich",
  "Fritz",
  "Georg",
  "Gerd",
  "Gert",
  "Gerhard",
  "Günter",
  "Günther",
  "Gustav",
  "Hans",
  "Harald",
  "Harry",
  "Harri",
  "Heinrich",
  "Heinz",
  "Helmut",
  "Helmuth",
  "Herbert",
  "Hermann",
  "Horst",
  "Johann",
  "Johannes",
  "Josef",
  "Joseph",
  "Klaus",
  "Claus",
  "Ludwig",
  "Max",
  "Oskar",
  "Oscar",
  "Otto",
  "Paul",
  "Richard",
  "Robert",
  "Rolf",
  "Rudolf",
  "Rudolph",
  "Walter",
  "Walther",
  "Werner",
  "Wilhelm",
  "Willi",
  "Willy",
  "Wolfgang",
];

const DE1920_FEMALE_FIRST_NAMES = [
  "Alma",
  "Anna",
  "Anneliese",
  "Annemarie",
  "Anni",
  "Annie",
  "Anny",
  "Auguste",
  "Berta",
  "Bertha",
  "Carla",
  "Karla",
  "Charlotte",
  "Clara",
  "Klara",
  "Dora",
  "Dorothea",
  "Edith",
  "Elfriede",
  "Elisabeth",
  "Elise",
  "Ella",
  "Elli",
  "Elly",
  "Else",
  "Emma",
  "Erika",
  "Erna",
  "Eva",
  "Frieda",
  "Frida",
  "Gerda",
  "Gertrud",
  "Gisela",
  "Hannelore",
  "Hedwig",
  "Helene",
  "Helga",
  "Hertha",
  "Herta",
  "Hildegard",
  "Ida",
  "Ilse",
  "Inge",
  "Ingeborg",
  "Ingrid",
  "Irma",
  "Irmgard",
  "Johanna",
  "Katharina",
  "Käthe",
  "Lieselotte",
  "Lisa",
  "Lotte",
  "Luise",
  "Louise",
  "Margarethe",
  "Margarete",
  "Margot",
  "Maria",
  "Marie",
  "Martha",
  "Marta",
  "Minna",
  "Olga",
  "Ruth",
  "Ursula",
  "Waltraud",
  "Wilhelmine",
];

const DE1920_FIRST_NAMES = [
  ...DE1920_MALE_FIRST_NAMES,
  ...DE1920_FEMALE_FIRST_NAMES,
];

const DE1920_LAST_NAMES = [
  "Müller",
  "Baumgarten",
  "Schmidt",
  "Behrendt",
  "Schneider",
  "Bohnet",
  "Fischer",
  "Dolge",
  "Weber",
  "Döring",
  "Meyer",
  "Fenger",
  "Wagner",
  "Fries",
  "Becker",
  "Genießer",
  "Schulz",
  "Goecks",
  "Hoffmann",
  "Graumann",
  "Schäfer",
  "Holten",
  "Koch",
  "Hoppendstedt",
  "Bauer",
  "Ibscher",
  "Richter",
  "Karoske",
  "Klein",
  "Landstruth",
  "Wolf",
  "Lopane",
  "Schröder",
  "Melisa",
  "Neumann",
  "Näthe",
  "Schwarz",
  "Nera",
  "Zimmermann",
  "Orchidee",
  "Braun",
  "Peisker",
  "Krüger",
  "Poetig",
  "Hofmann",
  "Reinken",
  "Hartmann",
  "Schlech",
  "Lange",
  "Schnarrenheuser",
  "Schmitt",
  "Tanneberger",
  "Werner",
  "Trimer",
  "Schmitz",
  "Tschöpe",
  "Krause",
  "Wertheimer",
  "Meier",
  "Zeissner",
  "Lehmann",
  "Schmid",
  "Schulze",
  "Affenstein",
  "Maier",
  "Basedow",
  "Köhler",
  "Baudissin",
  "Herrmann",
  "Beaulieu-Marconnay",
  "König",
  "Carlowitz",
  "Walter",
  "Clairon d'Haussonville",
  "Mayer",
  "Doberschütz",
  "Huber",
  "Drašković",
  "Kaiser",
  "Eschenbach",
  "Fuchs",
  "Falkenburg",
  "Peters",
  "Garczynski",
  "Lang",
  "Gentil de Lavallade",
  "Scholz",
  "Hauenstein",
  "Möller",
  "von der Heyde",
  "Weiß",
  "Itzenplitz",
  "Jung",
  "Jagow",
  "Hahn",
  "Kottwitz",
  "Schubert",
  "Lacković",
  "Vogel",
  "Lehwaldt",
  "Friedrich",
  "Maltitz",
  "Keller",
  "Neuhaus",
  "Günther",
  "Praun",
  "Frank",
  "Unruh",
  "Berger",
  "Wurmlingen",
  "Winkler",
  "Xylander",
  "Roth",
  "Yrsch",
  "Beck",
  "Zitzewitz",
];

const US1920_MALE_FIRST_NAMES = [
  "John",
  "William",
  "Robert",
  "James",
  "Charles",
  "George",
  "Joseph",
  "Edward",
  "Frank",
  "Richard",
  "Thomas",
  "Harold",
  "Walter",
  "Paul",
  "Raymond",
  "Donald",
  "Henry",
  "Arthur",
  "Albert",
  "Jack",
  "Harry",
  "Ralph",
  "Kenneth",
  "Howard",
  "David",
  "Clarence",
  "Carl",
  "Louis",
  "Earl",
  "Roy",
  "Fred",
  "Joe",
  "Lawrence",
  "Ernest",
  "Leonard",
  "Lion",
  "Warren",
  "Stanley",
  "Herbert",
  "Alfred",
  "Anthony",
  "Samuel",
  "Elmer",
  "Bernard",
  "Norman",
  "Leo",
  "Andrew",
  "Michael",
  "Russell",
  "Daniel",
  "Edwin",
  "Melvin",
  "Chester",
  "Leroy",
  "Peter",
  "Lloyd",
  "Clifford",
  "Frederick",
  "Floyd",
];

const US1920_FEMALE_FIRST_NAMES = [
  "Willie",
  "Francis",
  "Sam",
  "Marion",
  "Jessie",
  "Jose",
  "Ellis",
  "Charley",
  "Carlos",
  "Lynn",
  "Laverne",
  "Cleo",
  "Clair",
  "Merlin",
  "Carmen",
  "Patsy",
  "Sammie",
  "Teddy",
  "Lavern",
  "Shirley",
  "Mary",
  "Olin",
  "Guadalupe",
  "Marlin",
  "Augustine",
  "Otha",
  "Fay",
  "Jewel",
  "Kelly",
  "Ora",
  "Dorsey",
  "Trinidad",
  "Bernice",
  "Jewell",
  "Frances",
  "Carol",
  "Lacy",
  "Clare",
  "Rosario",
  "Dana",
  "Mahlon",
  "Claudie",
  "Pearl",
  "Doris",
  "Ike",
  "Angel",
  "Ivory",
  "Hazel",
  "Dorothy",
  "Estel",
  "Ruby",
  "June",
  "Vernie",
  "Claire",
  "Vivian",
  "Beryl",
  "Audrey",
  "Bonnie",
  "Elza",
];

const US1920_FIRST_NAMES = [
  ...US1920_MALE_FIRST_NAMES,
  ...US1920_FEMALE_FIRST_NAMES,
];

const US1920_LAST_NAMES = [
  "Hayes",
  "Abraham",
  "Heminger",
  "Allen",
  "Henchal",
  "Ankins",
  "Hidland",
  "Arandt",
  "Hilt",
  "Arthur",
  "Hogue",
  "Avery",
  "Hollister",
  "Baker",
  "Hollman",
  "Barnham",
  "Howell",
  "Best",
  "Hyde",
  "Bevard",
  "Kegley",
  "Bhenki",
  "Kinney",
  "Blakely",
  "Leach",
  "Bouche",
  "Lehman",
  "Boursaw",
  "Len",
  "Brant",
  "Levard",
  "Brawley",
  "Lindh",
  "Brockman",
  "Lynch",
  "Burns",
  "Madison",
  "Butterfield",
  "Markwart",
  "Caffey",
  "Matchinski",
  "Cantin",
  "Mathews",
  "Christopher",
  "McCutchen",
  "Codere",
  "McDonald",
  "Collins",
  "McGraw",
  "Cowell",
  "Morris",
  "Cowman",
  "Moses",
  "Crankovitch",
  "Neyenquam",
  "Cuttling",
  "Nickels",
  "Darwin",
  "Norval",
  "Davis",
  "O'Connell",
  "Dorman",
  "O'Neal",
  "Drafs",
  "O'Neil",
  "Drefs",
  "Olson",
  "Eakley",
  "Patterson",
  "Eddie",
  "Peppin",
  "Edwards",
  "Perkins",
  "Elliott",
  "Porter",
  "Elsner",
  "Price",
  "Farwell",
  "Proton",
  "Feigel",
  "Ripley",
  "Fenske",
  "Rosental",
  "Fergin",
  "Rossini",
  "Fillman",
  "Russell",
  "Finley",
  "Sawyer",
  "Firske",
  "Schroeder",
  "Flatt",
  "Schwartz",
  "Floria",
  "Shaw",
  "Fralich",
  "Smith",
  "Franklin",
  "Stewart",
  "Freeman",
  "Strong",
  "Furlong",
  "Thomas",
  "Garvin",
  "Traver",
  "Germain",
  "Urton",
  "Goodwin",
  "Vallier",
  "Gray",
  "White",
  "Greenwald",
  "Winters",
  "Griffith",
  "Woods",
  "Hancock",
  "Yeske",
  "Hastings",
  "Zibart",
];

const parseList = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const pickRandom = (items: string[]) => items[Math.floor(Math.random() * items.length)];

const generateName = (firstNamesText: string, lastNamesText: string) => {
  const firstNames = parseList(firstNamesText);
  const lastNames = parseList(lastNamesText);

  if (!firstNames.length && !lastNames.length) {
    return "";
  }

  if (!firstNames.length) {
    return pickRandom(lastNames);
  }

  if (!lastNames.length) {
    return pickRandom(firstNames);
  }

  return `${pickRandom(firstNames)} ${pickRandom(lastNames)}`;
};

const generatePdfName = (firstNames: string[], lastNames: string[]) =>
  `${pickRandom(firstNames)} ${pickRandom(lastNames)}`;

class NameGeneratorSettingTab extends PluginSettingTab {
  plugin: NameGeneratorPlugin;

  constructor(app: App, plugin: NameGeneratorPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;
    containerEl.empty();
    containerEl.createEl("h2", {text: "Name Generator settings"});

    new Setting(containerEl)
      .setName("First names")
      .setDesc("One first name per line.")
      .addTextArea((text) => {
        text
          .setValue(this.plugin.settings.firstNames)
          .onChange(async (value) => {
            this.plugin.settings.firstNames = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.rows = 8;
        text.inputEl.cols = 30;
      });

    new Setting(containerEl)
      .setName("Male first names")
      .setDesc("One male first name per line.")
      .addTextArea((text) => {
        text
          .setValue(this.plugin.settings.maleFirstNames)
          .onChange(async (value) => {
            this.plugin.settings.maleFirstNames = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.rows = 8;
        text.inputEl.cols = 30;
      });

    new Setting(containerEl)
      .setName("Female first names")
      .setDesc("One female first name per line.")
      .addTextArea((text) => {
        text
          .setValue(this.plugin.settings.femaleFirstNames)
          .onChange(async (value) => {
            this.plugin.settings.femaleFirstNames = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.rows = 8;
        text.inputEl.cols = 30;
      });

    new Setting(containerEl)
      .setName("Last names")
      .setDesc("One last name per line.")
      .addTextArea((text) => {
        text
          .setValue(this.plugin.settings.lastNames)
          .onChange(async (value) => {
            this.plugin.settings.lastNames = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.rows = 8;
        text.inputEl.cols = 30;
      });
  }
}

export default class NameGeneratorPlugin extends Plugin {
  settings: NameGeneratorSettings;

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onload() {
    await this.loadSettings();
    console.log("loading name generator plugin");

    this.addCommand({
      id: "name-generator-insert-de-random-name",
      name: "Insert DE random name",
      editorCallback: (editor: Editor) => {
        const name = generatePdfName(DE1920_FIRST_NAMES, DE1920_LAST_NAMES);

        new Notice(`DE name: ${name}`);
        insertName(editor, name);
      },
    });

    this.addCommand({
      id: "name-generator-insert-de-male-name",
      name: "Insert DE male name",
      editorCallback: (editor: Editor) => {
        const name = generatePdfName(DE1920_MALE_FIRST_NAMES, DE1920_LAST_NAMES);

        new Notice(`DE male name: ${name}`);
        insertName(editor, name);
      },
    });

    this.addCommand({
      id: "name-generator-insert-de-female-name",
      name: "Insert DE female name",
      editorCallback: (editor: Editor) => {
        const name = generatePdfName(DE1920_FEMALE_FIRST_NAMES, DE1920_LAST_NAMES);

        new Notice(`DE female name: ${name}`);
        insertName(editor, name);
      },
    });

    this.addCommand({
      id: "name-generator-insert-us-random-name",
      name: "Insert US random name",
      editorCallback: (editor: Editor) => {
        const name = generatePdfName(US1920_FIRST_NAMES, US1920_LAST_NAMES);

        new Notice(`US name: ${name}`);
        insertName(editor, name);
      },
    });

    this.addCommand({
      id: "name-generator-insert-us-male-name",
      name: "Insert US male name",
      editorCallback: (editor: Editor) => {
        const name = generatePdfName(US1920_MALE_FIRST_NAMES, US1920_LAST_NAMES);

        new Notice(`US male name: ${name}`);
        insertName(editor, name);
      },
    });

    this.addCommand({
      id: "name-generator-insert-us-female-name",
      name: "Insert US female name",
      editorCallback: (editor: Editor) => {
        const name = generatePdfName(US1920_FEMALE_FIRST_NAMES, US1920_LAST_NAMES);

        new Notice(`US female name: ${name}`);
        insertName(editor, name);
      },
    });
  }

  onunload() {
    console.log("unloading name generator plugin");
  }
}
