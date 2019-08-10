const AdmZip = require('adm-zip');

const zipName = 'city.list.json.zip';
const dict = {};

function parseName(name) {
    return name.toLowerCase().split(/ |-/).filter(Boolean).map(s => s.trim());
}

console.log(`Extracting ${zipName}...`);
var zip = new AdmZip(zipName);
var zipEntries = zip.getEntries();
if (zipEntries.length < 1) {
    throw new Error('Error: No city.list.json to unzip');
}
const cities = JSON.parse(zipEntries[0].getData().toString('utf8'));
console.log(`Loaded ${cities.length} locations`);

console.log('Indexing...');
cities.forEach(city => {
    const cityNames = parseName(city.name);
    cityNames.forEach(name => {
        if (!dict[name]) {
            dict[name] = [];
        }
        dict[name].push(city);
    });
});
console.log('Finished indexing');

function find(cityName, country, top) {
    const entries = [];
    cityName = cityName || '';
    country = country ? country.trim().toLowerCase() : '';
    const cityNames = parseName(cityName);
    cityNames.forEach(name => {
        const cities = dict[name];
        if (!cities) return;
        const weight = 1/cities.length;
        cities.forEach(city => {
            if (country && city.country.toLowerCase() !== country) return;
            const i = entries.findIndex(entry => entry.city.id === city.id);
            if (i === -1) {
                entries.push({
                    city, score: weight
                });
            } else {
                entries[i].score += weight;
            }
        });
    });
    entries.forEach(entry => {
        const scoreNames = parseName(entry.city.name);
        scoreNames.forEach(name => {
            const cities = dict[name];
            if (!cities) return;
            if (cityNames.includes(name)) return;
            const weight = 1/cities.length;
            entry.score -= weight;
        });
    });
    return entries
    .sort((entry1, entry2) => entry2.score - entry1.score)
    .slice(0, top || entries.length);
}
module.exports.find = find;

// const start = Date.now();
// const found = find();
// const dt = Date.now() - start;
// found
// .map(entry => `${entry.city.country}\t${entry.score.toFixed(20)}\t${entry.city.coord.lat},${entry.city.coord.lon}\t${entry.city.name}`)
// .forEach(f => console.log(f));
// console.log(`Done in ${dt} ms`);