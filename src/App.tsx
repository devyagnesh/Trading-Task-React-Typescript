import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import { RequestBuilder } from "./api/RequestBuilder";
import ReactApexChart from "react-apexcharts";

interface ChartDataPoint {
  x: number;
  y: number[];
}

interface ChartMetaData {
  [key: string]: string;
}

function App() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartMetaData, setChartMetaData] = useState<ChartMetaData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await RequestBuilder().get<{
          "Time Series (5min)": Record<string, Record<string, string>>,
          "Meta Data": Record<string, string>
        }>(
          `/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=VXW83AMEGWF1BSZG`
        );

        const responseData = response.data;

        const transformedData = Object.entries(
          responseData["Time Series (5min)"]
        ).map(([timestamp, data]) => {
          return [
            new Date(timestamp).getTime(),
            [
              parseFloat(data["1. open"]),
              parseFloat(data["2. high"]),
              parseFloat(data["3. low"]),
              parseFloat(data["4. close"]),
            ],
          ];
        });

        // Convert transformedData to ChartDataPoint[]
        const chartDataPoints: ChartDataPoint[] = transformedData.map(([x, y]) => ({
          x: Array.isArray(x) ? x[0] : x,
          y: Array.isArray(y) ? y : [y],
        }));

        setChartMetaData(() => responseData["Meta Data"]);
        setChartData(() => chartDataPoints);

        console.log(chartData);
        console.log(chartMetaData);
      } catch (error) {
        console.error("Uh Oh Something went wrong :( \n", error);
      }
    }

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#00B746",
          downward: "#EF403C",
        },
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tickAmount: 5,
    },
  };
  

  if (!chartMetaData || !chartData) {
    return <p>Couldn't Fetch Data Right Now</p>;
  }

  return (
    <>
      <Header />
      <div className="card shadow-lg max-w-sm mx-5 p-2">
        <div className="card-header text-xl font-bold bg-gray-200">Stock Information</div>
        <div className="card-body">
          <ul>
            {Object.keys(chartMetaData).map((key) => (
              <li key={key} className="list-item text-gray-700 mb-2">
                {key}: {chartMetaData[key]}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ReactApexChart option={chartOptions} type="candlestick" series={[{ data: chartData }]} height={400} />
    </>
  );
}

export default App;
