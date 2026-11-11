import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
        }}>
            <div style={{
                background: "#ffffff",
                padding: "36px 48px",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                border: "1px solid #e2e8f0"
            }}>
                <HashLoader color="#2563eb" size={50} />
                <div style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#0f172a",
                    letterSpacing: "-0.2px"
                }}>
                    Đang tải dữ liệu...
                </div>
            </div>
        </div>
    );
};

export default Loading;
