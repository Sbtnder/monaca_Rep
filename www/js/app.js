// API情報
var apiInfo = {
  id: 'dj00aiZpPTJoNmlYR0NXZzlaTiZzPWNvbnN1bWVyc2VjcmV0Jng9YTM-',   // Yahoo! Web APIのClient IDを貼り付けます
  url: 'https://map.yahooapis.jp/weather/V1/place'
};

// 起動時の処理
document.addEventListener('deviceready', function() {
  search();
  document.querySelector('#refreshButton').addEventListener('click', search);
});

// 検索処理を実行
function search() {
  document.querySelector('#modal').show();
  
  // STEP(1) 位置情報の取得
navigator.geolocation.getCurrentPosition(function(position){
    var location = position.coords.longitude　+ ',' + position.coords.latitude;
    console.log(location);
    getWeatherData(location);
}, function(error){
    onError('位置情報の取得に失敗しました。')
})


}

// 降水量情報を取得
function getWeatherData(location) {
  // STEP(2) Web APIの実行
$.ajax({
    url:apiInfo.url,
    timeout:1000,
    data: {
        appid:apiInfo.id,
        coordinates:location,
        output:'json'
    }
})
.done(function(result){
    console.log(JSON.stringify(result));
    var title = result.Feature[0].Name;
    var weatherList = result.Feature[0].Property.WeatherList.Weather;
    showResult(title, weatherList);
})
.fail(function(error){
    onError('通信エラーが発生しました。');
});



}

// 結果を表示
function showResult(title, weatherList) {
  document.querySelector('#resultTitle').textContent = title;
  var htmlStr = '<tr><th>時刻</th><th>降水強度(単位:mm/h)</th><th>種別</th></tr>';
  weatherList.forEach(function(weather) {
    htmlStr += '<tr>' +
      '<td>' + weather.Date.slice(-4,-2) + ':' + weather.Date.slice(-2) + '</td>' +
      '<td>' + weather.Rainfall + '</td>' +
      '<td>' + (weather.Type === 'observation' ? '実測値' : '予測値') + '</td>' +
      '</tr>';
  });
  document.querySelector('#resultTable').innerHTML = htmlStr;
  document.querySelector('#modal').hide();
}

// エラー発生時の動作
function onError(message) {
  document.querySelector('#modal').hide();
  alert(message);
}

