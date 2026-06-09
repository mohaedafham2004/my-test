import { OWMCurrentWeatherResponse, WeatherVerdict } from '../types/weather.types';

export function scoreWeather(data: OWMCurrentWeatherResponse): WeatherVerdict {
  let score = 0;
  const weatherId = data.weather[0].id;
  const weatherMain = data.weather[0].main;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const visibility = data.visibility;

  // Temperature (25 pts) — ideal 20–28°C
  if (temp >= 20 && temp <= 28)      score += 25;
  else if (temp >= 16 && temp < 20)  score += 18;
  else if (temp > 28 && temp <= 32)  score += 15;
  else if (temp > 32 && temp <= 36)  score += 8;

  // Weather condition (30 pts)
  if (weatherId === 800)                          score += 30;
  else if (weatherId >= 801 && weatherId <= 802)  score += 25;
  else if (weatherId >= 803 && weatherId <= 804)  score += 15;
  else if (weatherId >= 300 && weatherId <= 321)  score += 12;
  else if (weatherId >= 500 && weatherId <= 501)  score += 10;
  else if (weatherId >= 502 && weatherId <= 531)  score += 3;
  else if (weatherId >= 200 && weatherId <= 232)  score += 0;
  else if (weatherId >= 600 && weatherId <= 622)  score += 5;
  else if (weatherId >= 700 && weatherId <= 781)  score += 8;
  else score += 5;

  // Wind speed (15 pts)
  if (windSpeed < 5)       score += 15;
  else if (windSpeed < 10) score += 10;
  else if (windSpeed < 15) score += 5;

  // Humidity (15 pts)
  if (humidity >= 40 && humidity <= 65)      score += 15;
  else if (humidity > 65 && humidity <= 80)  score += 10;
  else if (humidity > 80)                    score += 5;
  else                                       score += 10;

  // Visibility (15 pts)
  if (visibility >= 8000)      score += 15;
  else if (visibility >= 5000) score += 10;
  else if (visibility >= 2000) score += 5;

  return buildVerdict(score, weatherId, weatherMain);
}

function buildVerdict(score: number, weatherId: number, _weatherMain: string): WeatherVerdict {
  const rating: 'GOOD' | 'MODERATE' | 'BAD' =
    score >= 70 ? 'GOOD' : score >= 45 ? 'MODERATE' : 'BAD';

  let condition_tag: string;
  if (weatherId === 800)                          condition_tag = 'Sunny';
  else if (weatherId >= 801 && weatherId <= 802)  condition_tag = 'Partly Cloudy';
  else if (weatherId >= 803 && weatherId <= 804)  condition_tag = 'Cloudy';
  else if (weatherId >= 300 && weatherId <= 321)  condition_tag = 'Drizzling';
  else if (weatherId >= 500 && weatherId <= 501)  condition_tag = 'Light Rain';
  else if (weatherId >= 502 && weatherId <= 531)  condition_tag = 'Heavy Rain';
  else if (weatherId >= 200 && weatherId <= 232)  condition_tag = 'Thunderstorm';
  else if (weatherId >= 700 && weatherId <= 781)  condition_tag = 'Misty';
  else                                            condition_tag = 'Mixed';

  const adviceMap: Record<'GOOD' | 'MODERATE' | 'BAD', string[]> = {
    GOOD:     ['Excellent day to visit! Clear skies ahead.', 'Great weather for outdoor exploration.', 'Perfect conditions for photography and sightseeing.'],
    MODERATE: ['Decent conditions. Carry a light jacket.', 'Partly cloudy — good for visiting but pack a rain cover.', 'Weather is manageable. Start early to make the most of it.'],
    BAD:      ['Poor weather conditions. Consider postponing outdoor activities.', 'Heavy rain expected. Indoor sightseeing recommended.', 'Stormy conditions — stay safe and check back later.'],
  };
  const travel_advice = adviceMap[rating][Math.floor(Math.random() * 3)];

  const suitableMap: Record<'GOOD' | 'MODERATE' | 'BAD', string[]> = {
    GOOD:     ['hiking', 'photography', 'picnics', 'sightseeing', 'beach visits'],
    MODERATE: ['sightseeing', 'indoor attractions', 'short hikes'],
    BAD:      ['museums', 'indoor temples', 'hotel rest'],
  };
  const notSuitableMap: Record<'GOOD' | 'MODERATE' | 'BAD', string[]> = {
    GOOD:     [],
    MODERATE: ['long hikes', 'beach swimming', 'outdoor photography'],
    BAD:      ['hiking', 'outdoor events', 'beach visits', 'photography'],
  };

  return {
    score,
    rating,
    condition_tag,
    travel_advice,
    suitable_for: suitableMap[rating],
    not_suitable_for: notSuitableMap[rating],
  };
}
