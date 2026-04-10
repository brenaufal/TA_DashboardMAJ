<template>
  <div class="w-full">

    <!-- Chart Card -->
    <div class="border rounded-xl p-4 bg-white shadow-sm">
      <div ref="highchartContainer" class="w-full h-[420px]"></div>
    </div>

    <!-- Table -->
    <div
      v-if="!faIsLoading && chartOptions.xAxis?.categories?.length"
      class="mt-4 overflow-x-auto"
      :key="tableKey"
    >
      <div class="fc-table min-w-max">
        <div
          v-for="(row, rIdx) in tableRowsDynamic"
          :key="row.name + '-' + rIdx"
          class="fc-row"
          :style="{ gridTemplateColumns: fcGridCols }"
        >
          <div :class="nameCellClass(row)">
            <template v-if="row.type === 'barchart'">
              <span class="swatch-box" :style="{ '--fill': row.color || '#999' }"></span>
            </template>
            <template v-else-if="row.type === 'spline'">
              <span class="swatch-dash" :style="{ '--fill': row.color || '#8BC34A' }"></span>
              <span class="swatch-dash" :style="{ '--fill': row.color || '#8BC34A' }"></span>
            </template>
            <span class="name-text">{{ row.name }}</span>
          </div>

          <div
            v-for="(v, i) in row.data"
            :key="row.name + '-' + i"
            class="fc-cell"
          >
            <span v-if="v !== null && v !== undefined" :class="cellFontClass(v)">
              {{ row.name === '%' ? Math.round(v * 100) + '%' : new Intl.NumberFormat('id-ID').format(v) }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Highcharts from 'highcharts';
import forecastData from '@/assets/mock-data/forecast_actual.json';

export default {
  name: 'PlanDeliveryChart',
  props: {
    model: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        xAxis: {
          categories: []
        }
      },
      series: [],
      hcChart: null,
      firstColW: 110,
      colWidth: 32,
      tableSeries: [],
      tableKey: 0,
      faIsLoading: false,
      faModelKey: this.model
    };
  },
  watch: {
    model: {
      immediate: true,
      handler() {
        this.fetchData();
      }
    }
  },
  methods: {
    async fetchData() {
      this.faIsLoading = true;

      try {
        const data = forecastData;
        const modelData = data[this.model] || [];
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        const categories = Array.from({ length: lastDayOfMonth }, (_, i) => `${i + 1}`);

        this.tableSeries = modelData.map((item) => ({
          name: item.header,
          type: item.type,
          color: item.color,
          data: (item.dailies_qty || []).slice(0, categories.length)
        }));

        this.faModelKey = this.model;
        this.faIsLoading = false;
        this.updateChartData(data);
      } catch (error) {
        console.error('Error processing mock data:', error);
        this.faIsLoading = false;
      }
    },

    getSeries(name) {
      return this.tableSeries.find((series) => series.name === name);
    },

    nameCellClass(row) {
      const noAvatar = row.type !== 'barchart' && row.type !== 'spline';
      if (noAvatar || row.name === 'DN' || row.name === '%') return 'fc-name2';
      return 'fc-name';
    },

    cellFontClass(value) {
      const formatted = new Intl.NumberFormat('id-ID').format(value);
      return formatted.length > 5 ? 'small-font' : '';
    },

    updateChartData(data) {
      const modelData = data[this.model] || [];
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const todayIdx = now.getDate() - 1;
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      const categories = Array.from({ length: lastDayOfMonth }, (_, i) => `${i + 1}`);

      const splitAF = (arr, currentIdx) => ({
        actual: arr.map((value, index) => (index <= currentIdx ? value : null)),
        forecast: arr.map((value, index) => (index > currentIdx ? value : null))
      });

      const barSeries = modelData
        .filter((item) => item.type === 'barchart')
        .map((item) => ({
          type: 'column',
          name: item.header,
          data: (item.dailies_qty || []).slice(0, categories.length),
          color: item.color || '#1A73E8',
          yAxis: 0,
          stack: 'a'
        }));

      const lineSeries = modelData
        .filter((item) => item.type === 'spline')
        .flatMap((item) => {
          const trimmed = (item.dailies_qty || []).slice(0, categories.length);
          const parts = splitAF(trimmed, todayIdx);
          const color = item.color || '#FF5733';

          return [
            {
              type: 'spline',
              name: item.header,
              data: parts.actual,
              color,
              lineWidth: 2.5,
              yAxis: 1
            },
            {
              type: 'spline',
              name: item.header,
              linkedTo: ':previous',
              showInLegend: false,
              data: parts.forecast,
              color,
              dashStyle: 'LongDash',
              lineWidth: 2.5,
              yAxis: 1
            }
          ];
        });

      const maxVal = Math.max(
        ...barSeries.flatMap((series) => series.data).filter((value) => value != null),
        ...lineSeries.flatMap((series) => series.data).filter((value) => value != null),
        0
      );

      const plotLines = [];
      const plotBands = [];

      if (todayIdx === 0) {
        plotLines.push({
          value: todayIdx + 0.5,
          color: '#00BCD4',
          width: 2,
          dashStyle: 'ShortDot',
          label: {
            text: 'FORECAST',
            align: 'left',
            rotation: 0,
            x: 8,
            y: 15,
            style: { color: '#00BCD4', fontWeight: 'bold', fontSize: '10px' }
          },
          zIndex: 5
        });
      } else if (todayIdx === categories.length - 1) {
        plotLines.push({
          value: todayIdx + 0.5,
          color: '#00BCD4',
          width: 2,
          dashStyle: 'ShortDot',
          label: {
            text: 'ACTUAL',
            align: 'right',
            rotation: 0,
            x: -8,
            y: 15,
            style: { color: '#00BCD4', fontWeight: 'bold', fontSize: '10px' }
          },
          zIndex: 5
        });
      } else {
        plotLines.push(
          {
            value: todayIdx + 0.5,
            color: '#00BCD4',
            width: 2,
            dashStyle: 'ShortDot',
            label: {
              text: 'FORECAST',
              align: 'left',
              rotation: 0,
              x: 8,
              y: 15,
              style: { color: '#00BCD4', fontWeight: 'bold', fontSize: '10px' }
            },
            zIndex: 5
          },
          {
            value: todayIdx + 0.5,
            color: 'transparent',
            width: 0,
            label: {
              text: 'ACTUAL',
              align: 'right',
              rotation: 0,
              x: -8,
              y: 15,
              style: { color: '#00BCD4', fontWeight: 'bold', fontSize: '10px' }
            },
            zIndex: 5
          }
        );
      }

      if (todayIdx < categories.length - 1) {
        plotBands.push({
          from: todayIdx + 0.5,
          to: categories.length,
          color: 'rgba(0,188,212,0.05)'
        });
      }

      this.series = [...barSeries, ...lineSeries];
      this.chartOptions = {
        chart: {
          backgroundColor: 'transparent',
          height: 420,
          type: 'column',
          spacingLeft: 55
        },
        credits: { enabled: false },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'top'
        },
        xAxis: {
          categories,
          labels: { style: { color: '#333' } },
          plotLines,
          plotBands
        },
        yAxis: [
          {
            min: 0,
            title: { text: '' },
            gridLineColor: '#ececec',
            plotLines: [
              {
                value: maxVal * 1.05,
                color: '#FF3333',
                dashStyle: 'Dash',
                width: 2,
                zIndex: 5
              }
            ]
          },
          {
            min: 0,
            title: { text: '' },
            opposite: true,
            gridLineColor: '#ececec'
          }
        ],
        tooltip: {
          shared: true,
          useHTML: true,
          formatter: function () {
            const idx = this.points?.[0]?.point?.index ?? this.point.index;
            const dayLabel = this.series.chart.xAxis[0].categories[idx] || idx + 1;

            let html = `<b>Hari ${dayLabel}</b><br/>`;
            (this.points || []).forEach((point) => {
              html += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${new Intl.NumberFormat('id-ID').format(point.y || 0)}</b><br/>`;
            });
            return html;
          }
        },
        title: { text: '' },
        plotOptions: {
          column: {
            stacking: 'normal',
            groupPadding: 0.08,
            pointPadding: 0.05,
            borderWidth: 0.5,
            borderColor: '#fff'
          },
          spline: {
            marker: {
              enabled: false,
              states: {
                hover: {
                  enabled: true,
                  radius: 4
                }
              }
            }
          }
        },
        series: this.series
      };

      this.$nextTick(() => {
        if (this.hcChart && typeof this.hcChart.destroy === 'function') {
          this.hcChart.destroy();
        }

        if (this.$refs.highchartContainer) {
          this.hcChart = Highcharts.chart(this.$refs.highchartContainer, this.chartOptions);

          this.$nextTick(() => {
            if (this.hcChart) {
              this.colWidth = Math.floor(
                this.hcChart.plotWidth / this.chartOptions.xAxis.categories.length
              );
              this.tableKey += 1;
            }
          });
        }
      });
    }
  },
  mounted() {
    this.fetchData();
  },
  beforeUnmount() {
    if (this.hcChart && typeof this.hcChart.destroy === 'function') {
      this.hcChart.destroy();
    }
  },
  computed: {
    tableRowsDynamic() {
      const rows = [];
      const pushUnique = (row) => {
        if (!row.name || !Array.isArray(row.data)) return;
        if (row.linkedTo) return;
        if (!rows.some((item) => item.name === row.name)) {
          rows.push(row);
        }
      };

      this.tableSeries
        .filter((series) => series.type === 'barchart')
        .forEach((series) => {
          pushUnique({
            name: series.name,
            type: series.type,
            color: series.color,
            data: series.data
          });
        });

      ['DN', 'SAP', 'KAP', 'TMMIN'].forEach((name) => {
        const series = this.getSeries(name);
        if (!series) return;
        if (name === 'DN' && this.faModelKey === 'DN_HMMI') return;
        pushUnique({
          name,
          type: series.type || 'tableOnly',
          color: series.color,
          data: series.data
        });
      });

      if (this.faModelKey === 'DN_HMMI') {
        const series = this.getSeries('DN');
        if (series) {
          pushUnique({
            name: 'DN',
            type: series.type || 'tableOnly',
            color: series.color,
            data: series.data
          });
        }
      }

      ['CUMM DO', 'CUMM DN'].forEach((name) => {
        const series = this.getSeries(name);
        if (series) {
          pushUnique({
            name,
            type: 'spline',
            color: series.color,
            data: series.data
          });
        }
      });

      const pct = this.getSeries('%');
      if (pct) {
        pushUnique({
          name: '%',
          type: 'tableOnly',
          data: pct.data,
          isPercent: true
        });
      }

      this.tableSeries
        .filter((series) => series.type === 'spline')
        .forEach((series) => {
          pushUnique({
            name: series.name,
            type: series.type,
            color: series.color,
            data: series.data
          });
        });

      return rows;
    },

    fcGridCols() {
      if (!this.chartOptions?.xAxis?.categories) return '';
      const cols = [this.firstColW + 'px'];
      for (let i = 0; i < this.chartOptions.xAxis.categories.length; i += 1) {
        cols.push(this.colWidth + 'px');
      }
      return cols.join(' ');
    }
  }
};
</script>

<style scoped>
.line-card {
  background-color: transparent;
  border-radius: 12px;
  height: auto;
  text-align: center;
  width: auto;
}

.fc-table {
  background: transparent;
  margin: 4px 0;
  font-size: 11px;
  line-height: 1.2;
  border-collapse: collapse;
  border: 1px solid #000;
  border-bottom: none;
}

.fc-row {
  display: grid;
  border-bottom: 1px solid #000;
}

.fc-row:last-child {
  border-bottom: 1px solid #000;
}

.fc-name,
.fc-name2,
.fc-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 4px;
  box-sizing: border-box;
  min-width: 0;
  color: #000;
}

.fc-name {
  font-weight: 600;
  border-left: none;
}

.fc-name2 {
  justify-content: center;
  font-weight: 600;
  border-left: none;
}

.name-text {
  flex: 1;
  display: flex;
  justify-content: center;
  text-align: center;
}

.small-font {
  font-size: 9px;
}

.fc-cell {
  border-left: 1px solid #000;
  text-align: center;
}

.swatch-box {
  --fill: #999;
  width: 24px;
  height: 10px;
  background: var(--fill);
  border: 2px solid #000;
  border-radius: 2px;
}

.swatch-dash {
  --fill: #8bc34a;
  width: 18px;
  height: 6px;
  background: var(--fill);
  border-radius: 6px;
  margin-right: 6px;
}
</style>
