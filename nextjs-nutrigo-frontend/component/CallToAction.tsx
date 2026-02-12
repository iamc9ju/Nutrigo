import Button from "./Button";

export default function CallToAction() {
    return (
        <section className="py-24 bg-[#0a0a0a] text-white text-center rounded-t-[3rem] lg:rounded-[3rem] max-w-7xl mx-auto lg:my-10 relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-[#A3D133]/10"></div>

            <div className="relative z-10 px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">เริ่มดูแลสุขภาพของคุณวันนี้</h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                    อย่ารอให้ป่วยก่อนค่อยดูแล ปรึกษาผู้เชี่ยวชาญและรับแผนโภชนาการที่เหมาะกับคุณได้เลย
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="bg-[#A3D133] text-black border-none hover:bg-[#b5e63d]">
                        ประเมินสุขภาพฟรี
                    </Button>
                    <Button size="lg" variant="outline" className="text-black border-white hover:bg-white hover:text-black">
                        ดูแพ็กเกจราคา
                    </Button>
                </div>
            </div>
        </section>
    );
}