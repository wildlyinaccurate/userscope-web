import React, { Fragment } from "react"
import MainLayout, { MainLayoutProps } from "./layouts/main"

type HomeViewProps = MainLayoutProps

export default function HomeView(props: HomeViewProps) {
  const chartScript = <ChartScript />

  return (
    <MainLayout {...props} scripts={chartScript} wrappingContainer={false}>
      <div className="container py-4">
        <div className="row">
          <div className="col-md-6 py-lg-4 mx-auto">
            <h2 className="display-4">Deliver great user experiences that anyone can enjoy</h2>
            <p className="lead">Monitor your web site accessibility over time and get actionable insights.</p>
          </div>
          <div className="col-md-6 py-lg-4 mt-4">
            <canvas id="sample-chart" className="p-3 bg-white rounded-lg shadow"></canvas>
          </div>
        </div>
      </div>

      <div className="bg-white py-4">
        <div className="container">
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
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          <div className="col-md-7 py-lg-4 mt-4">
            <h2>Get better feedback</h2>
            <p className="lead">
              Improve your user testing sessions by automatically identifying and fixing issues beforehand.
            </p>
          </div>
          <div className="col-md-5 py-lg-4 mx-auto">
            <img className="w-100" src="/images/undraw_web_browsing_p77h.svg" />
          </div>
        </div>
      </div>

      <div className="bg-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-5 py-lg-4 mx-auto">
              <img className="w-100" src="/images/undraw_online_test_gba7.svg" />
            </div>
            <div className="col-md-7 py-lg-4 mt-4">
              <h2>Improve your test coverage</h2>
              <p className="lead">
                Get coverage and insights from multiple industry-standard tools like Lighthouse and bbc-a11y.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

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
                backgroundColor: "hsl(20, 90%, 50%)",
                borderColor: "hsl(20, 90%, 50%)",
                label: "UserScope Score",
                fill: false,
                data: [65, 66, 59, 75, 79, 79, 80]
              },
              {
                backgroundColor: "hsl(300, 50%, 40%)",
                borderColor: "hsl(300, 50%, 40%)",
                label: "Accessibility Issues",
                fill: false,
                data: [18, 18, 20, 13, 12, 12, 9]
              }
            ]
          },
          options: {
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
