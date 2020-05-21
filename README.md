# pvoutput-to-influx

reads pvoutput solar panel data from exported csv file and imports it to influxdb

## preparation

- create account / login to pvoutput.org
- go to [https://pvoutput.org/download.jsp]
- select a range and download csv file
- if multiple years of data are required, download the separate csv files or merge them manually

## usage

```
Usage: pvoutput-to-influx [options] <csvfile> <influxurl>

read pvoutput from csv file and import it to influxdb

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

## example

`node pvoutput-to-influx.js pvoutput-example.csv http://localhost:8086/pv`
