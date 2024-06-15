import './HomeComponent.css'
import Filter from '../Filter/FilterComponent';
import PieChart, { PieChartProps, PieChartData } from '../PieChart/PieChartComponent';
import ColumnChart, { ColumnData } from '../ColumnChart/ColumnChartComponent';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Category, Product } from '../api.interfaces';
import { Button, CircularProgress } from '@mui/material';
import { ColumnChartProps } from '../ColumnChart/ColumnChartComponent';

export const RunReportCtx = createContext({
    categoryNames: [] as string[],
    setCategoryNames: (...args: any) => { },
    productNames: [] as string[],
    setProductNames: (...args: any) => { },
    categories: [] as Category[],
    setCategories: (...args: any) => { },
    products: [] as Product[],
    setProducts: (...args: any) => { },
    selectedCategory: '',
    setSelectedCategory: (...args: any) => { },
    selectedProducts: [] as Product[],
    setSelectedProducts: (...args: any) => { },
    updateChart: false,
    setUpdateChart: (...args: any) => { },
    setDisableRunBtn: (...args: any) => { }
})

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [categoryNames, setCategoryNames] = useState<string[]>([])
    const [productNames, setProductNames] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [updateChart, setUpdateChart] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const [disableRunBtn, setDisableRunBtn] = useState(true)
    const [chartData, setChartData] = useState<ColumnChartProps>({
        data: selectedProducts.map((product) => {
            return { name: product.title, y: product.price }
        }),
        yAxisName: 'Price',
        xAxisName: 'Categories',
        title: 'Products in selected Categories'

    })
    const [pieChartData, setPieChartData] = useState<PieChartProps>({
        data: [{ name: 'Default', y: 1 }],
        title: 'Categories'
    })
    const runReport = () => {
        setShowLoader(true)
        setTimeout(() => setShowLoader(false), 3000)
        if (selectedProducts.length > 0) {
            const data: ColumnData[] = selectedProducts.map((product) => {
                return { name: product.title, y: product.price }
            })
            const chartData = {
                data, xAxisName: selectedCategory,
                yAxisName: 'Price',
                title: 'Products in selected Categories'
            }
            setChartData(chartData)
            setDisableRunBtn(true)
        }
    }

    const loadPieChart = () => {
        if (categoryNames.length > 0) {
            const data: PieChartData[] = categoryNames.map(name => {
                return { name, y: 1 }
            })
            const pieChartData = {
                data,
                title: 'Categories'
            }
            setPieChartData(pieChartData)
        }
    }

    const loadBarChart = () => {
        const data = products.map(product => {
            return {
                name: product.title,
                y: product.price
            }
        })
        const chartData: ColumnChartProps = {
            data,
            xAxisName: selectedCategory,
            yAxisName: 'Price',
            title: 'Products in selected Categories'
        }
        setChartData(chartData)
    }

    useEffect(() => {
        loadPieChart()
    }, [categoryNames])

    useEffect(() => {
        if (updateChart) {
            setShowLoader(true)
            setTimeout(() => setShowLoader(false), 3000)
            loadBarChart()
        }
        setUpdateChart(false)
    }, [updateChart])

    useEffect(() => {
        if(!selectedCategory || (selectedProducts.length === 0)) {
            setDisableRunBtn(true)
        }
    }, [selectedCategory, selectedProducts])

    return (
        <div className="home">
            <RunReportCtx.Provider value={
                {
                    categories,
                    setCategories,
                    products,
                    setProducts,
                    categoryNames,
                    setCategoryNames,
                    productNames,
                    setProductNames,
                    selectedCategory,
                    selectedProducts,
                    setSelectedCategory,
                    setSelectedProducts,
                    updateChart,
                    setUpdateChart,
                    setDisableRunBtn
                }
            }>
                <div className='filterArea'>
                    <Filter />
                    <div className='runBtn'>
                        <Button variant="contained" disabled={!selectedCategory || disableRunBtn} onClick={() => runReport()}>Run Report</Button>
                    </div>
                </div>

                <div className='chartArea'>
                    <div className='loader'>
                        {showLoader ? <CircularProgress disableShrink /> :
                            <div>
                                {!selectedCategory ? <PieChart {...pieChartData} /> : ''}
                                {selectedCategory ? <ColumnChart {...chartData} /> : ''}
                            </div>
                        }
                    </div>

                </div>
            </RunReportCtx.Provider>
        </div>
    );
}
