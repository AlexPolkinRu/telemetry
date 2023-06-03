// Глобальные переменные
let pageTitle = 'Сегодня в доме';
let dataSource = 'http://alexpolkin.tech/charts/today.php';

// Получение контекста для рисования
let canvas = document.getElementById('chartjs');
let context = canvas.getContext('2d');

// Функции
const createLineChart = (xData, tempData, humData) => {
    let data = {
        labels: xData,
        datasets: [
            {
                label: 'Температура',
                yAxisID: 'temp',
                data: tempData,
                pointStyle: false,
                fill: true,
                borderWidth: 2,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)'
            }, {
                label: 'Влажность',
                yAxisID: 'hum',
                data: humData,
                pointStyle: false,
                fill: true,
                borderWidth: 2,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)'
            }
        ]
    }

    let timeScaleConfig = {
        ticks: {
            autoSkip: true,
            // maxRotation: 0,
            minRotation: 90,
            color: 'rgba(0, 0, 0, 0.9)'
        },
        border: {
            color: 'rgba(0, 0, 0, 1)'
        },
        grid: {
            color: 'rgba(0, 0, 0, 0.1)'
        }
    }

    let tempScaleConfig = {
        id: 'temp',
        type: 'linear',
        min: 0,
        max: 50,
        position: 'left',
        ticks: {
            color: 'rgb(255, 99, 132)'
        },
        border: {
            color: 'rgba(0, 0, 0, 1)'
        },
        grid: {
            color: 'rgba(255, 99, 132, 0.2)'
        }
    }

    let humScaleConfig = {
        id: 'hum',
        type: 'linear',
        min: 20,
        max: 90,
        position: 'right',
        ticks: {
            color: 'rgb(54, 162, 235)'
        },
        border: {
            color: 'rgba(0, 0, 0, 1)'
        },
        grid: {
            color: 'rgba(54, 162, 235, 0.2)'
        }
    }
    
    let config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: timeScaleConfig,
                temp: tempScaleConfig,
                hum: humScaleConfig,
            },
            plugins: {
                title: {
                    display: true,
                    text: pageTitle
                }
            }
        }
    }

    let chart = new Chart(context, config);
}

// Получение данных с сервера
axios.get(dataSource)
    .then((response) => {
        let data = response.data;
        let timeData = [];
        let tempData = [];
        let humData = [];
        // console.log(response);
        for (let i = 0; i < data.length; i++) {
            timeData.push(data[i].time);
            tempData.push(data[i].temp);
            humData.push(data[i].hum);
        }
        createLineChart(timeData, tempData, humData);
    })