const parse = require('csv-parse');
const fs = require('fs');
const moment = require('moment');
const Influx = require('influxdb-nodejs');

const { program } = require('commander');
let influxClient;

const convertTimestampToMoment = function (date) {
    let timestamp = moment(date, 'DD-MM-YY');
    timestamp.hour(23);
    timestamp.minute(0);
    return timestamp;
};

const writeInflux = function(line) {
    const timestamp = convertTimestampToMoment(line.DATE);
    return influxClient.write('pvstatus2')
        .time(timestamp.format('X'), 's')
        .field({
            energyGeneration: parseInt(line.GENERATED) || 0,
            powerGeneration: undefined,
            temperature: undefined,
            voltage: undefined,
        })
        .queue();
};

const parser = parse({
    delimiter: ',',
    columns: true,
}, async function(err, data){
    const promises = data.map((line) => {
        return writeInflux(line);
    });

    try {
        console.log('pvoutput-to-influx writing to influx ...');
        const results = await Promise.all(promises);
    } catch (err) {
        console.log(err);
        return;
    }
    influxClient.syncWrite().then(() => {
        console.log(`pvoutput-to-influx done writing ${data.length} lines`);
    })
    .catch(console.error);
});

program
    .version('1.0.0')
    .arguments('<csvfile> <influxurl>')
    .description('read pvoutput from csv file and import it to influxdb')
    .action((csv, influxurl) => {
        console.log('pvoutput-to-influx connecting to influx');
        influxClient = new Influx(influxurl);

        console.log('pvoutput-to-influx reading csv...');
        fs.createReadStream(__dirname+'/'+csv).pipe(parser);
    }).parse(process.argv);
