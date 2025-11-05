'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'

const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error('useChart must be used within a <ChartContainer />')
  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, c]) => c.theme || c.color)
  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme as keyof typeof item.theme] || item.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join('\n')}
}
`)
          .join('\n'),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

type TooltipPayloadItem = {
  dataKey?: string
  name?: string
  value?: any
  payload?: Record<string, any>
  color?: string
}

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  payload?: TooltipPayloadItem[]
  indicator?: 'line' | 'dot' | 'dashed'
  hideLabel?: boolean
  hideIndicator?: boolean
  label?: React.ReactNode
  labelFormatter?: (label: React.ReactNode, payload: TooltipPayloadItem[]) => React.ReactNode
  labelClassName?: string
  formatter?: (value: any, name: string, props: any) => React.ReactNode
  color?: string
  nameKey?: string
  labelKey?: string
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
  ...props
}: ChartTooltipContentProps): React.JSX.Element | null {
  const { config } = useChart()

  if (!active || !payload?.length) return null

  const tooltipLabel = !hideLabel && payload[0]
    ? (() => {
        const key = `${labelKey || payload[0].dataKey || payload[0].name || 'value'}`
        const itemConfig = getPayloadConfigFromPayload(config, payload[0], key)
        const val =
          !labelKey && typeof label === 'string'
            ? config[label]?.label || label
            : itemConfig?.label
        if (!val) return null
        return <div className={cn('font-medium', labelClassName)}>{val}</div>
      })()
    : null

  return (
    <div
      className={cn(
        'border-border/50 bg-background grid min-w-[8rem] gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        className
      )}
      {...props}
    >
      {tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload?.fill || item.color

          return (
            <div key={item.dataKey} className="flex w-full items-center gap-2">
              {!hideIndicator && (
                <div
                  className="shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: indicatorColor,
                    width: indicator === 'dot' ? '0.6rem' : '0.2rem',
                    height: '0.6rem'
                  }}
                />
              )}
              <div className="flex flex-1 justify-between leading-none">
                <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                {item.value != null && (
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : String(item.value)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'verticalAlign'> & {
    hideIcon?: boolean
    nameKey?: string
  }) {
  const { config } = useChart()

  

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      
    
    </div>
  )
}


function getPayloadConfigFromPayload(config: ChartConfig, payload: any, key: string) {
  const base = payload?.payload
  const resolved =
    (typeof payload?.[key] === 'string' && payload?.[key]) ||
    (typeof base?.[key] === 'string' && base?.[key]) ||
    key
  return config[resolved] || config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
