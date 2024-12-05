export function Hero() {
    return (
        <><div className="text-slate-900 font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-center dark:text-white p-4 mt-8 flex items-center justify-center space-x-4">
            <img src="/talkarena-logo.svg" alt="Logo" className="w-24 h-24" />
            Interactive Evaluation of Large Audio Models
        </div>
        <div className="text-slate-600 text-center dark:text-slate-400 p-4">
                Ella Minzhi Li<sup>* †</sup>, Will Held<sup>* †</sup>, Michael J. Ryan<sup>†</sup>, Kunat Pipatanakul<sup>^</sup>, Potsawee Manakul<sup>^</sup>, Hao Zhu<sup>†</sup>, Diyi Yang<sup>†</sup>
        </div>
        <div className="text-slate-600 text-center dark:text-slate-400 p-4">
                <sup>*</sup>Equal Contribution
        </div>
        <div className="text-slate-600 text-center dark:text-slate-400 p-4">
                <sup>†</sup>Stanford University,<sup>^</sup>SCB 10X
        </div></>
    )
}
