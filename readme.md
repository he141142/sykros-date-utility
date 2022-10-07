## SETUP:
```ts
    let _ = dateUtilities({
    datePeriod: 5,
    logger: "common logger",
    debug: true,
    pluginPeriod: false
})
```

## OPTION PARAMETERS:
- required: 
  + datePeriod: to add specific day to date then compare with the present
  + logger: plug in your logger
  + debug: enable debug mode
  + utcMode: convert the present time to start or end of this day
  + pluginPeriod: enable pluginPeriod to compare

## Sample usage

```ts
//time.now() is 2022-08-10
let isExpired: boolean;
//return false
isExpired = _.DisablePlugin().IsExpired(new Date("2022-12-11"));

isExpired = _.DisablePlugin().IsExpired(new Date("2022-04-10")); //return true time.now() > 2022-04-10   
/**
 * Set date period to 5 this mean add 5 days to date parameter
 */
isExpired = _.EnablePlugin().SetDatePeriod(5).IsExpired(new Date("2022-04-10")); // return false time.now() < 2022-09-10   

```