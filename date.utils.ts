
export const dateUtilities = (dateUtilityOP: UtilityOP) => {
  const now = new Date();
  const isRedeemPeriodPluginEnable = dateUtilityOP.pluginPeriod;
  const setUTC = (time: Date) => {
    let baseDate = new Date(time.getTime());
    return {
      SetEndOfDate: function() {
        time.setUTCHours(23, 59, 59, 999);
      },
      SetStartOfDate: function() {
        time.setUTCHours(0, 0, 0, 0);
      },
      Reverse: function() {
        time = new Date(baseDate.getTime());
      }
    };
  };
  const AddDatePeriod = function(dateToAdd: Date, day: number): Date {
    dateToAdd.setDate(dateToAdd.getDate() + day);
    return dateToAdd;
  };
  const IsExpired = function (time: Date): boolean {
    const isTimeExpired = function(time: Date, timeNow: Date): boolean {
      return isRedeemPeriodPluginEnable
        ? timeNow.getTime() -
        AddDatePeriod(time, dateUtilityOP.datePeriod).getTime() >
        0
        : timeNow.getTime() - time.getTime() > 0;
    };
    if (dateUtilityOP.utcMode) {
      let nowCoppy = new Date(now.getTime());
      switch (dateUtilityOP.utcMode) {
        case UTC_MODE.START_DATE:
          setUTC(nowCoppy).SetStartOfDate();
          break;
        case  UTC_MODE.END_DATE:
          setUTC(nowCoppy).SetEndOfDate();
          break;
      }
      console.log(nowCoppy);
      return isTimeExpired(time, nowCoppy);
    }
    return isTimeExpired(time, now);
  };
  const DisablePlugin = () => {
    dateUtilityOP.pluginPeriod = false;
    return dateUtilities(dateUtilityOP);
  };
  const EnablePlugin = () => {
    dateUtilityOP.pluginPeriod = true;
    return dateUtilities(dateUtilityOP);
  };
  const SetDatePeriod = (period: number) => {
    dateUtilityOP.datePeriod = period;
    return dateUtilities(dateUtilityOP);
  };
  const setContext = (context: string) => {
    dateUtilityOP.case = context;
    return dateUtilities(dateUtilityOP);
  };
  const getDateIsTheSmallest = (...dates: Date[]): Date => {
    return dates.reduce((acc, date) => {
      if (acc.getTime() - date.getTime() > 0) {
        return date;
      }
      return acc;
    }, dates[0]);
  };
  const isDateInInterval = (interval: dateInterval): boolean => {
    if (interval.from.getTime() > interval.to.getTime()) {
      return false;
    }
    //default is now
    const check = interval.check ? interval.check : now;
    return (
      check.getTime() - interval.from.getTime() >= 0 &&
      check.getTime() - interval.to.getTime() <= 0
    );
  };
  const pickTimeNearTheCurrent = (
    joinDatePeriodStart: Date,
    redeemStartDate: Date,
  ): Date => {
    if (joinDatePeriodStart.getTime() > now.getTime()) {
      return redeemStartDate;
    } else {
      const gapBetweenNowAndJoinDatePeriodStart =
        now.getTime() - joinDatePeriodStart.getTime();
      const gapBetweenNowAndRedeemStartDate =
        now.getTime() - redeemStartDate.getTime();
      return gapBetweenNowAndJoinDatePeriodStart <
        gapBetweenNowAndRedeemStartDate
        ? joinDatePeriodStart
        : redeemStartDate;
    }
  };
  const setUTCMode = (utcMode: UTC_MODE) =>{
    dateUtilityOP.utcMode = utcMode;
    return dateUtilities(dateUtilityOP);
  }
  return {
    IsExpired,
    AddDatePeriod,
    DisablePlugin,
    EnablePlugin,
    SetDatePeriod,
    setContext,
    getDateIsTheSmallest,
    isDateInInterval,
    pickTimeNearTheCurrent,
    setUTC,
    setUTCMode
  };
};

export interface UtilityOP {
  pluginPeriod: boolean;
  datePeriod: number;
  utcMode?: UTC_MODE;
  case?: string;
  debug?: boolean;
  logger?: any;
}

export class dateInterval {
  from: Date;
  to: Date;
  check?: Date;
}


export enum UTC_MODE {
  START_DATE = 1,
  END_DATE = 2,
}