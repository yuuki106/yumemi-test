import React, { useState, useEffect } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PopulationData {
  name: string;
  data: { year: number; value: number }[];
}




const PrefectureCheckboxList: React.FC = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [selectedPopulationKind, setSelectedPopulationKind] =
    useState<string>("all");
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    chart: {
      type: "line",
    },
    title: {
      text: "人口推移グラフ",
    },
    xAxis: {
      title: {
        text: "年度",
      },
    },
    yAxis: {
      title: {
        text: "人口数",
      },
    },
    series: [
      {
        type: "line",
        data: [], 
      },
    ],
    accessibility: {
      enabled: false,
    },
  });

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const response = await axios.get(
          "https://opendata.resas-portal.go.jp/api/v1/prefectures",
          {
            headers: {
              "X-API-KEY": apiKey,
            },
          }
        );
        setPrefectures(response.data.result);
      } catch (error) {
        console.error("Error fetching prefectures:", error);
      }
    };

    fetchPrefectures();
  }, []);

  useEffect(() => {

    const fetchPopulationData = async () => {
      try {
        if (selectedPrefectures.length === 0) {
          setPopulationData([]);
          return;
        }
        const populationDataPromises = selectedPrefectures.map(
          async (prefCode) => {
            let dataIndex = 0;
            if (selectedPopulationKind === "all") {
              dataIndex = 0;
            } else if (selectedPopulationKind === "young") {
              dataIndex = 1;
            } else if (selectedPopulationKind === "workingAgePopulation") {
              dataIndex = 2;
            } else if (selectedPopulationKind === "old") {
              dataIndex = 3;
            }
            const response = await axios.get(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`, {
              headers: {
                "X-API-KEY": apiKey,
              },
            });
            return {
              name:
                prefectures.find((pref) => pref.prefCode === prefCode)
                  ?.prefName ?? "",

              data: response.data.result.data[dataIndex].data,
            };
          }
        );

        const populationData = await Promise.all(populationDataPromises);
        setPopulationData(populationData);
      } catch (error) {
        console.error("Error fetching population data:", error);
      }
    };

    fetchPopulationData();
  }, [selectedPrefectures, prefectures, selectedPopulationKind]);

  useEffect(() => {
    const updatedChartOptions: Highcharts.Options = {
      ...chartOptions,
      xAxis: {
        title: {
          text: "年度",
        },
        categories:
          populationData.length > 0
            ? populationData[0].data.map((item) => String(item.year))
            : [],
      },
      yAxis: {
        title: {
          text: "人口数",
        },
      },
      series: populationData.map((data) => ({
        type: "line",
        name: data.name,
        data: data.data.map((item) => item.value),
      })),
    };

    setChartOptions(updatedChartOptions);
  }, [populationData]);

  const handlePopulationKindChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPopulationKind(event.target.value);
  };

  const handleCheckboxChange = (prefCode: number) => {
    if (selectedPrefectures.includes(prefCode)) {
      setSelectedPrefectures(
        selectedPrefectures.filter((code) => code !== prefCode)
      );
    } else {
      setSelectedPrefectures([...selectedPrefectures, prefCode]);
    }
  };

  return (
    <>
      <ul className="prefList">
        {prefectures.map((prefecture) => (
          <li key={prefecture.prefCode}>
            <label>
              <input
                type="checkbox"
                value={prefecture.prefCode}
                checked={selectedPrefectures.includes(prefecture.prefCode)}
                onChange={() => handleCheckboxChange(prefecture.prefCode)}
              />
              {prefecture.prefName}
            </label>
          </li>
        ))}
      </ul>
      <select
        name="populationKind"
        id="selectPopulationKind"
        onChange={handlePopulationKindChange}
      >
        <option value="all">総人口</option>
        <option value="young">年少人口</option>
        <option value="workingAgePopulation">生産年齢人口</option>
        <option value="old">老年人口</option>
      </select>
      <div className="populationGraph">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </>
  );
};

export default PrefectureCheckboxList;
