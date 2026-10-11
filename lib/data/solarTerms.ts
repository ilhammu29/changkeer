export interface SolarTermBlend {
  term: string;
  termChinese: string;
  starts: string;
  blend: string;
  hotPrice: string;
  icedPrice: string;
  isBrewingNow?: boolean;
}

export interface AddOnItem {
  name: string;
  noteOrTaste: string;
  price: string;
}

export const SOLAR_TERM_BLENDS: SolarTermBlend[] = [
  { term: 'Start of Spring', termChinese: '立春', starts: '4 Feb', blend: 'First Bloom', hotPrice: '24K', icedPrice: '26K' },
  { term: 'Rain Water', termChinese: '雨水', starts: '18 Feb', blend: 'Rain Garden', hotPrice: '20K', icedPrice: '22K' },
  { term: 'Awakening of Insects', termChinese: '惊蛰', starts: '5 Mar', blend: 'Green Wake', hotPrice: '15K', icedPrice: '17K' },
  { term: 'Spring Equinox', termChinese: '春分', starts: '20 Mar', blend: 'Even Day', hotPrice: '22K', icedPrice: '24K' },
  { term: 'Clear and Bright', termChinese: '清明', starts: '4 Apr', blend: 'Clear Sky', hotPrice: '18K', icedPrice: '20K' },
  { term: 'Grain Rain', termChinese: '谷雨', starts: '20 Apr', blend: 'Barley Field', hotPrice: '20K', icedPrice: '22K' },
  { term: 'Start of Summer', termChinese: '立夏', starts: '5 May', blend: 'Hibiscus Sun', hotPrice: '18K', icedPrice: '20K' },
  { term: 'Grain Buds', termChinese: '小满', starts: '21 May', blend: 'Pandan Lime', hotPrice: '15K', icedPrice: '17K' },
  { term: 'Grain in Ear', termChinese: '芒种', starts: '5 Jun', blend: 'Mango Jasmine', hotPrice: '26K', icedPrice: '28K' },
  { term: 'Summer Solstice', termChinese: '夏至', starts: '21 Jun', blend: 'Longest Day', hotPrice: '18K', icedPrice: '20K' },
  { term: 'Minor Heat', termChinese: '小暑', starts: '7 Jul', blend: 'Cool Leaf', hotPrice: '15K', icedPrice: '17K' },
  { term: 'Major Heat', termChinese: '大暑', starts: '22 Jul', blend: 'Chrysanthemum Lemon', hotPrice: '20K', icedPrice: '22K' },
  { term: 'Start of Autumn', termChinese: '立秋', starts: '7 Aug', blend: 'Osmanthus Pear', hotPrice: '26K', icedPrice: '28K' },
  { term: 'End of Heat', termChinese: '处暑', starts: '23 Aug', blend: 'Late Rose', hotPrice: '22K', icedPrice: '24K' },
  { term: 'White Dew', termChinese: '白露', starts: '7 Sep', blend: 'White Dew', hotPrice: '22K', icedPrice: '24K' },
  { term: 'Autumn Equinox', termChinese: '秋分', starts: '23 Sep', blend: 'Golden Hour', hotPrice: '24K', icedPrice: '26K' },
  { term: 'Cold Dew', termChinese: '寒露', starts: '8 Oct', blend: 'First Rain', hotPrice: '20K', icedPrice: '22K', isBrewingNow: true },
  { term: "Frost's Descent", termChinese: '霜降', starts: '23 Oct', blend: 'Ginger Rose', hotPrice: '20K', icedPrice: '22K' },
  { term: 'Start of Winter', termChinese: '立冬', starts: '7 Nov', blend: 'Spice Lantern', hotPrice: '22K', icedPrice: '24K' },
  { term: 'Minor Snow', termChinese: '小雪', starts: '22 Nov', blend: 'Longan Nest', hotPrice: '28K', icedPrice: '30K' },
  { term: 'Major Snow', termChinese: '大雪', starts: '7 Dec', blend: 'Ginger Goji', hotPrice: '18K', icedPrice: '20K' },
  { term: 'Winter Solstice', termChinese: '冬至', starts: '21 Dec', blend: 'Solstice Cup', hotPrice: '24K', icedPrice: '26K' },
  { term: 'Minor Cold', termChinese: '小寒', starts: '5 Jan', blend: 'Red Date Warmth', hotPrice: '26K', icedPrice: '28K' },
  { term: 'Major Cold', termChinese: '大寒', starts: '20 Jan', blend: 'Cinnamon Ember', hotPrice: '18K', icedPrice: '20K' },
];

export const DRIED_FRUITS: AddOnItem[] = [
  { name: 'Goji berries', noteOrTaste: 'sweet-tart', price: '+3K' },
  { name: 'Red dates (jujube)', noteOrTaste: 'caramel-like, naturally sweet', price: '+3K' },
  { name: 'Longan', noteOrTaste: 'rich, honeyed', price: '+4K' },
  { name: 'Dried pear', noteOrTaste: 'soft, mellow sweetness', price: '+3K' },
  { name: 'Dried apple', noteOrTaste: 'fruity, light', price: '+3K' },
  { name: 'Dried mango', noteOrTaste: 'ripe, tropical', price: '+4K' },
  { name: 'Dried lemon slice', noteOrTaste: 'bright, citrusy', price: '+2K' },
  { name: 'Orange peel', noteOrTaste: 'zesty, slightly bitter', price: '+2K' },
];

export const DRIED_FLOWERS: AddOnItem[] = [
  { name: 'Rose buds', noteOrTaste: 'soft floral aroma', price: '+3K' },
  { name: 'Chrysanthemum', noteOrTaste: 'mellow, honey-like', price: '+3K' },
  { name: 'Butterfly pea', noteOrTaste: 'earthy; turns the cup blue', price: '+3K' },
  { name: 'Hibiscus (rosella)', noteOrTaste: 'tart, ruby-red', price: '+3K' },
  { name: 'Jasmine', noteOrTaste: 'sweet, fragrant', price: '+4K' },
  { name: 'Osmanthus', noteOrTaste: 'apricot-like scent', price: '+4K' },
];

export const SWEETENERS: AddOnItem[] = [
  { name: 'Unsweetened', noteOrTaste: 'default for every cup', price: 'Free' },
  { name: 'Sorghum sugar', noteOrTaste: 'local, mild caramel taste', price: '+2K' },
  { name: 'Palm sugar syrup (gula aren)', noteOrTaste: 'deep, smoky sweetness', price: '+2K' },
  { name: 'Stevia leaf', noteOrTaste: 'zero-calorie, plant-based', price: '+2K' },
  { name: 'Raw local honey', noteOrTaste: 'floral; best in hot cups', price: '+4K' },
];

export const HEALTH_CAUTIONS = [
  'Skip chrysanthemum if allergic to daisy-family plants.',
  'Avoid hibiscus during pregnancy.',
  'Check with a doctor before adding ginger or goji if you take blood thinners.',
  'Ask the brew bar for full ingredient info.',
];
