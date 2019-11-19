import React, { Fragment } from "react"
import MainLayout, { MainLayoutProps } from "./layouts/main"

type HomeViewProps = MainLayoutProps

const chartScript = <ChartScript />

const HomeView = (props: HomeViewProps) => (
  <MainLayout {...props} scripts={chartScript}>
    <div className="row my-4">
      <div className="col-md-6 py-lg-4 mx-auto">
        <h2 className="display-4">Deliver great user experiences that anyone can enjoy</h2>
        <p className="lead">Monitor your web site accessibility over time and get actionable insights.</p>
      </div>
      <div className="col-md-6 py-lg-4 mt-4">
        <canvas id="sample-chart"></canvas>
      </div>
    </div>

    <div className="row justify-content-sm-center">
      <div className="col-md-8">
        <h3 className="my-3">Get a free accessibility report now</h3>

        <form action="/test/run" method="POST">
          <input type="hidden" name="_csrf" value={props._csrf} />
          <div className="input-group mb-3">
            <input
              type="text"
              name="url"
              placeholder="Enter a URL to generate a report"
              aria-label="URL to test"
              aria-describedby="generate-report-btn"
              className="form-control"
            />
            <div className="input-group-append">
              <button type="submit" id="generate-report-btn" className="btn btn-primary">
                Generate Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </MainLayout>
)

function ChartScript() {
  return (
    <Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: `
      const canvas = document.getElementById("sample-chart")
      if (canvas) {
        const ctx = canvas.getContext("2d")
        Chart.defaults.global.defaultFontFamily = "Lato, sans-serif"
        Chart.defaults.global.defaultFontStyle = "bold"
        Chart.defaults.global.defaultFontSize = 15
        const daysAgo = (days) => {
          const d = new Date((new Date() - 1000 * 60 * 60 * 24 * days))
          return [d.getDate(), d.getDay()].join(" ")
        }
        const config = {
          type: "line",
          data: {
            labels: [daysAgo(7), daysAgo(6), daysAgo(5), daysAgo(4), daysAgo(3), daysAgo(2), daysAgo(1)],
            datasets: [
              {
                backgroundColor: "#f5793a",
                borderColor: "#f5793a",
                label: "UserScope Score",
                fill: false,
                data: [65, 66, 59, 75, 79, 79, 80]
              },
              {
                backgroundColor: "#a95aa1",
                borderColor: "#a95aa1",
                label: "Accessibility Issues",
                fill: false,
                data: [18, 18, 20, 13, 12, 12, 9]
              }
            ]
          },
          options: {
            layout: {
              padding: {
                right: 8
              }
            },
            legend: {
              align: "center",
              position: "bottom",
              labels: {
                boxWidth: 18
              }
            },
            scales: {
              xAxes: [{
                display: false
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  suggestedMax: 90,
                  maxTicksLimit: 8
                }
              }]
            }
          }
        }
        const sampleChart = new Chart(ctx, config)
      }
    `
        }}
      />
    </Fragment>
  )
}

export default HomeView
