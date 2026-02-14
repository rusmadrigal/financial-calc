Prompt para estándar de gráficos en calculadoras
Cuando crees o modifiques calculadoras en este proyecto, aplica este estándar de gráficos (igual que en /calculators/high-yield-savings-calculator):
Eje por año
Los gráficos deben usar el año en el eje X cuando haya (o se pueda derivar) datos temporales. No uses categorías genéricas en el eje X para resúmenes puntuales si existe una dimensión “por año”.
Dos gráficos cuando haya serie temporal
LineChart: evolución en el tiempo (p. ej. “Balance Over Time”).
Datos: { year, balance } (o la métrica que evolucione).
Eje X: year.
BarChart: dos series por año (p. ej. “Principal vs Interest by Year” o “Contributions vs Interest by Year”).
Datos: { year, serie1, serie2 }.
Eje X: year.
Dos barras por año con fill="var(--chart-1)" y fill="var(--chart-3)".
Tabla “Yearly Breakdown”
Incluir una tabla con los primeros 10 años (o 15 si aplica) con columnas: Year + las métricas que se muestran en los gráficos (p. ej. Balance, Principal, Interest o Contributions, Interest).
Mismo diseño visual
Card → CardHeader (CardTitle, CardDescription) → CardContent → div.h-[300px] → ResponsiveContainer → Chart.
CartesianGrid: strokeDasharray="3 3" y className="stroke-border".
XAxis: dataKey="year" y className="text-xs".
YAxis: className="text-xs".
Tooltip: mismo contentStyle (backgroundColor, border, borderRadius).
Casos especiales
Si no hay serie temporal (p. ej. costes de cierre únicos): un BarChart con “año” fijo (p. ej. Year 1) y varias barras por categoría.
Si la serie es la misma cada año (p. ej. impuesto fijo): mostrar evolución acumulada en el LineChart y en el BarChart dos series por año (p. ej. anual vs acumulado).
Resumen: Los gráficos deben reflejar datos por año (eje X = año), con LineChart de evolución y BarChart de dos (o más) series por año, más tabla de desglose anual, usando siempre este mismo diseño.

Calculadoras a crear