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
        const matches = [];
        const cities = dict[name];
        if (cities) {
            matches.push({cities: dict[name], score: 1});
        } else {
            Object.keys(dict).forEach(indexedName => {
                const match = indexedName.match(name);
                if (!match) return;
                const score = 1 - Math.abs(match[0].length - indexedName.length)/indexedName.length;
                if (score < 0) return;
                matches.push({cities: dict[indexedName], score});
            });
        }
        matches.forEach(match => {
            const cities = match.cities;
            let score = match.score
            score /= cities.length;
            cities.forEach(city => {
                if (country && city.country.toLowerCase() !== country) return;
                const i = entries.findIndex(entry => entry.city.id === city.id);
                if (i === -1) {
                    entries.push({
                        city, score
                    });
                } else {
                    entries[i].score += score;
                }
            });
        });
    });
    entries.forEach(entry => {
        const scoreNames = parseName(entry.city.name);
        scoreNames.forEach(name => {
            const cities = dict[name];
            if (!cities) return;
            if (cityNames.includes(name)) return;
            const score = 1/cities.length;
            entry.score -= score;
        });
    });
    return entries
    .sort((entry1, entry2) => entry2.score - entry1.score)
    .slice(0, top || entries.length);
}
module.exports.find = find;

function testFind(cityName, country, top) {
    const start = Date.now();
    const founds = (find(cityName, country, top) || []).slice(0, 10);
    const dt = Date.now() - start;
    console.log(`Found ${founds.length} results for ${cityName}${country ? `,${country}` : ''} in ${dt} ms`);
    if (founds.length) {
        founds.forEach(found => {
            console.log(`${found.city.name},${found.city.country}`);
        });
    }
}

testFind('Rio de Janei');
