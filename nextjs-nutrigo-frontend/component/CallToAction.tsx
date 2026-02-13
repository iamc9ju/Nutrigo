import Button from "./Button";

export default function CallToAction() {
    return (
        <section className="py-24 bg-gradient-to-br from-[#e6f5c0] to-[#f0f7e2] text-center rounded-[3rem] max-w-7xl mx-auto my-10 relative overflow-hidden border border-[#d4e8a0]">
            <div className="absolute top-4 left-8 text-7xl opacity-15 rotate-12 select-none pointer-events-none">🍌</div>
            <div className="absolute bottom-4 right-8 text-7xl opacity-15 -rotate-12 select-none pointer-events-none">🥝</div>
            <div className="absolute top-1/2 right-16 text-5xl opacity-10 rotate-[-30deg] select-none pointer-events-none">🍑</div>
            <div className="absolute bottom-1/3 left-12 text-5xl opacity-10 rotate-[15deg] select-none pointer-events-none">🫑</div>

            <div className="relative z-10 px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">เริ่มดูแลสุขภาพของคุณวันนี้</h2>
                <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                    อย่ารอให้ป่วยก่อนค่อยดูแล ปรึกษาผู้เชี่ยวชาญและรับแผนโภชนาการที่เหมาะกับคุณได้เลย
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="bg-[#8BC34A] text-white border-none hover:bg-[#7ab33e] font-bold shadow-lg transition-all">
                        ประเมินสุขภาพฟรี
                    </Button>
                    <Button size="lg" variant="outline" className="text-[#4A6707] border-[#8BC34A] hover:bg-[#8BC34A] hover:text-white transition-all font-bold">
                        ดูแพ็กเกจราคา
                    </Button>
                </div>
            </div>
        </section>
    );
}