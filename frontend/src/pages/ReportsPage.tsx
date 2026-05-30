
import { TrendingUp, TrendingDown } from 'lucide-react';
import Sidebar from '../components/Sidebar.tsx';

export default function ReportsPage() {

    const stats = [
        { label: 'Всего отправлено', value: '12,543', change: '+12.5%', trend: 'up' },
        { label: 'Средний Open Rate', value: '24.8%', change: '+3.2%', trend: 'up' },
        { label: 'Средний Click Rate', value: '3.4%', change: '-0.8%', trend: 'down' },
        { label: 'Отписок', value: '127', change: '-5.2%', trend: 'up' },
    ];

    const topCampaigns = [
        { name: 'Летняя распродажа 2026', openRate: '34.5%', clicks: 412 },
        { name: 'Новинки недели', openRate: '28.3%', clicks: 278 },
        { name: 'Приветственная серия', openRate: '45.2%', clicks: 567 },
    ];

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Отчеты</h1>
                        <p className="text-muted-foreground">Анализ эффективности email-рассылок</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-card rounded-lg shadow-sm border p-6">
                                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-card rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Топ компаний по открытиям</h2>
                            <div className="space-y-4">
                                {topCampaigns.map((campaign, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{campaign.name}</p>
                                            <div className="mt-2 bg-muted rounded-full h-2">
                                                <div className="bg-primary h-2 rounded-full" style={{ width: campaign.openRate }} />
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="text-sm font-semibold text-foreground">{campaign.openRate}</p>
                                            <p className="text-xs text-muted-foreground">{campaign.clicks} кликов</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-card rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Активность по дням недели</h2>
                            <div className="space-y-3">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                                    const height = [70, 85, 65, 90, 75, 45, 40][index];
                                    return (
                                        <div key={day} className="flex items-center gap-3">
                                            <span className="w-8 text-sm text-muted-foreground">{day}</span>
                                            <div className="flex-1 bg-muted rounded-full h-8 relative">
                                                <div className="bg-primary h-8 rounded-full flex items-center justify-end pr-3" style={{ width: `${height}%` }}>
                                                    <span className="text-xs font-medium text-primary-foreground">{height}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">География открытий</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[['Москва', '42%'], ['Санкт-Петербург', '28%'], ['Казань', '15%'], ['Другие', '15%']].map(([city, pct]) => (
                                <div key={city} className="p-4 bg-background rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">{city}</p>
                                    <p className="text-2xl font-bold text-foreground">{pct}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
