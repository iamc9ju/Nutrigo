export default function AppPreview() {
    return (
        <section className="py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl font-bold mb-6">จัดการสุขภาพ<br />ได้ง่ายๆ บนมือถือ</h2>
                        <ul className="space-y-4 text-gray-600 mb-8">
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-[#A3D133] rounded-full"></span>
                                บันทึกอาหารและแคลอรี่ได้ในคลิกเดียว
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-[#A3D133] rounded-full"></span>
                                แชทปรึกษานักโภชนาการส่วนตัวได้ตลอด
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-[#A3D133] rounded-full"></span>
                                ติดตามกราฟน้ำหนักและสุขภาพแบบ Real-time
                            </li>
                        </ul>
                    </div>

                    {/* Mockup Phone UI */}
                    <div className="lg:w-1/2 relative">
                        {/* Circle Background decorative */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A3D133]/20 rounded-full blur-3xl -z-10"></div>

                        <div className="bg-gray-900 border-8 border-gray-800 rounded-[3rem] p-4 shadow-2xl max-w-sm mx-auto">
                            <div className="bg-white rounded-[2rem] aspect-[9/19] overflow-hidden flex flex-col items-center justify-center text-gray-400">
                                <span>App Interface Image</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
