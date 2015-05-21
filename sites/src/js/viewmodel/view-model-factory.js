import ContainerJS  from "container-js";
import Chart       from "./chart/chart";

export default class ViewModelFactory {

  constructor() {
    this.rates           = ContainerJS.Inject;
    this.preferences     = ContainerJS.Inject;
    this.rateService     = ContainerJS.Inject;
    this.positionService = ContainerJS.Inject;
    this.graphService    = ContainerJS.Inject;
  }
  createChart(displayPositionsAndGraphs=false, backtestId=null, graphs=[]) {
    return new Chart( this.rates, this.preferences,
      this.positionService, this.graphService, displayPositionsAndGraphs, backtestId, graphs );
  }

}
