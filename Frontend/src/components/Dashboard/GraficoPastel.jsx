import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";


ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export function ChartSwitcher({ dataForBar = [], approved, disapproved, type }) {
    // Data for Pie Chart
    const pieData = {
      labels: ["Aprobados", "Desaprobados"],
      datasets: [
        {
          label: "Estudiantes",
          data: [approved, disapproved],
          backgroundColor: ["#4CAF50", "#FF5252"], // Verde para aprobados, rojo para desaprobados
          borderColor: ["#388E3C", "#D32F2F"],
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  
    const pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw;
              const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${percentage}% (${value})`;
            },
          },
        },
      },
    };
  
    // Transform the dataForBar into labels and data for the Bar Chart
    const barData = {
      labels: ["Aprobados", "Desaprobados"], // Mantén la consistencia con el gráfico de pastel
      datasets: [
        {
          label: "Estudiantes",
          data: [approved, disapproved], // Usa los mismos valores que el gráfico de pastel
          backgroundColor: ["#4CAF50", "#FF5252"], // Colores consistentes
          borderColor: ["#388E3C", "#D32F2F"],
          borderWidth: 1,
        },
      ],
    };
  
    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Estado", // Etiqueta del eje X
            color: "#333",
          },
          grid: {
            display: false,
          },
          ticks: {
            color: "#333",
          },
        },
        y: {
          title: {
            display: true,
            text: "Número de estudiantes", // Etiqueta del eje Y
            color: "#333",
          },
          ticks: {
            beginAtZero: true,
            color: "#333",
          },
        },
      },
    };
  
    const chartStyle = {
      width: "100%",
      height: "300px",
    };
  
    return (
      <div className="w-full flex justify-center items-center">
        {type === "pie" ? (
          <div style={{ width: "300px", height: "300px" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        ) : (
          <div style={chartStyle}>
            <Bar data={barData} options={barOptions} />
          </div>
        )}
      </div>
    );
  }
  

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ approved, disapproved }) {
    const data = {
        labels: ['Aprobados', 'Desaprobados'],
        datasets: [
            {
                label: 'Estudiantes',
                data: [approved, disapproved],
                backgroundColor: ['#4CAF50', '#FF5252'], // Verde para aprobados, rojo para desaprobados
                hoverOffset: 4
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${percentage}% (${value})`;
                    }
                }
            }
        }
    };

    return <Pie data={data} options={options} />;
};