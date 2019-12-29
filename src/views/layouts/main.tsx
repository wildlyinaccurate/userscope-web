import React, { ReactNode, PropsWithChildren, FunctionComponent } from "react"
import Header from "../page-components/header"
import FlashMessages, { FlashMessageContainer } from "../page-components/flash"
import Footer, { PartialPackage } from "../page-components/footer"
import { UserDocument } from "userscope-data-models"

export interface MainLayoutProps {
  title: string
  user: UserDocument
  messages: FlashMessageContainer
  scripts?: ReactNode
  package: PartialPackage
  revision?: string
  wrappingContainer: boolean
  _csrf: string
}

const MainLayout: FunctionComponent<MainLayoutProps> = function(props: PropsWithChildren<MainLayoutProps>) {
  const containerClasses = props.wrappingContainer ? "container pt-5" : null

  return (
    <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{props.title} - UserScope</title>
        <meta
          name="description"
          content="UserScope is an automated accessibility testing tool. Get valuable insights and track your site's accessibility over time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="csrf-token" content={props._csrf} />
        <meta name="theme-color" content="#fafafa" />

        <link rel="stylesheet" href="/css/main.css" />
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `LUX=(function(){var a=("undefined"!==typeof(LUX)&&"undefined"!==typeof(LUX.gaMarks)?LUX.gaMarks:[]);var d=("undefined"!==typeof(LUX)&&"undefined"!==typeof(LUX.gaMeasures)?LUX.gaMeasures:[]);var j="LUX_start";var k=window.performance;var l=("undefined"!==typeof(LUX)&&LUX.ns?LUX.ns:(Date.now?Date.now():+(new Date())));if(k&&k.timing&&k.timing.navigationStart){l = k.timing.navigationStart}function f(){if(k&&k.now){return k.now()}var o=Date.now?Date.now():+(new Date());return o-l}function b(n){if(k){if(k.mark){return k.mark(n)}else{if(k.webkitMark){return k.webkitMark(n)}}}a.push({name:n,entryType:"mark",startTime:f(),duration:0});return}function m(p,t,n){if("undefined"===typeof(t)&&h(j)){t = j}if(k){if(k.measure){if(t){if(n){return k.measure(p,t,n)}else{return k.measure(p,t)}}else{return k.measure(p)}}else{if(k.webkitMeasure){return k.webkitMeasure(p,t,n)}}}var r=0,o=f();if(t){var s=h(t);if(s){r = s.startTime}else{if(k&&k.timing&&k.timing[t]){r = k.timing[t] - k.timing.navigationStart}else{return}}}if(n){var q=h(n);if(q){o = q.startTime}else{if(k&&k.timing&&k.timing[n]){o = k.timing[n] - k.timing.navigationStart}else{return}}}d.push({name:p,entryType:"measure",startTime:r,duration:(o-r)});return}function h(n){return c(n,g())}function c(p,o){for(i=o.length-1;i>=0;i--){var n=o[i];if(p===n.name){return n}}return undefined}function g(){if(k){if(k.getEntriesByType){return k.getEntriesByType("mark")}else{if(k.webkitGetEntriesByType){return k.webkitGetEntriesByType("mark")}}}return a}return{mark:b,measure:m,gaMarks:a,gaMeasures:d}})();LUX.ns=(Date.now?Date.now():+(new Date()));LUX.ac=[];LUX.cmd=function(a){LUX.ac.push(a)};LUX.init=function(){LUX.cmd(["init"])};LUX.send=function(){LUX.cmd(["send"])};LUX.addData=function(a,b){LUX.cmd(["addData", a, b])};LUX_ae=[];window.addEventListener("error",function(a){LUX_ae.push(a)});LUX_al=[];if("function"===typeof(PerformanceObserver)&&"function"===typeof(PerformanceLongTaskTiming)){var LongTaskObserver=new PerformanceObserver(function(c){var b=c.getEntries();for(var a=0;a<b.length; a++){var d=b[a];LUX_al.push(d)}});try{LongTaskObserver.observe({ type: ["longtask"] })}catch(e){}}`
          }}
        />
        <script src="https://cdn.speedcurve.com/js/lux.js?id=456946842" async defer crossOrigin="anonymous"></script>
      </head>

      <body>
        <Header user={props.user} />

        <div className={containerClasses}>
          <FlashMessages messages={props.messages} />
          {props.children}
        </div>

        <Footer revision={props.revision} package={props.package} />

        <script src="/vendor/jquery-3.3.1.slim.min.js"></script>
        <script src="/vendor/bootstrap-4.3.1.min.js"></script>
        <script src="/vendor/Chart-2.8.0.bundle.min.js"></script>
        <script src="/js/main.js"></script>
        {props.scripts}
      </body>
    </html>
  )
}

MainLayout.defaultProps = {
  wrappingContainer: true
}

export default MainLayout
