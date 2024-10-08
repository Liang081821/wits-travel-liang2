import { useState, useEffect } from "react";
import { fetchForm } from "../../firebase/fetchForm.jsx";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import emailjs from "@emailjs/browser";

export default function FormManage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [replyText, setReplyText] = useState("");
  const [viewReplied, setViewReplied] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchForm();
        console.log("Fetched forms data:", data);

        const formattedData = data.map((form) => ({
          id: form.id,
          category: form.subject,
          name: form.name,
          email: form.email,
          phone: form.phone,
          content: form.message,
          replied: form.replied,
          purpose: form.purpose,
          time: form.created_timestamp,
        }));

        setItems(formattedData);
        setFilteredItems(
          formattedData.filter((item) => item.replied === viewReplied),
        );
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    getData();
  }, [viewReplied]);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReply = async (id) => {
    try {
      const itemToUpdate = items.find((item) => item.id === id);
      const docRef = doc(db, "form", itemToUpdate.id);

      // 更新 Firestore 中的回覆狀態
      await updateDoc(docRef, { replied: true });

      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, replied: true } : item,
      );

      setItems(updatedItems);
      setFilteredItems(
        updatedItems.filter((item) => item.replied === viewReplied),
      );
      setExpandedItems((prev) => ({
        ...prev,
        [id]: false,
      }));

      // 發送回覆郵件
      emailjs.init(import.meta.env.VITE_EMAIL_USER_ID);
      emailjs
        .send(
          import.meta.env.VITE_EMAIL_SERVICE_ID,
          import.meta.env.VITE_EMAIL_TEMPLATE_ID,
          {
            to_name: itemToUpdate.name,
            from_name: "緯創旅遊",
            subject: `回覆：${itemToUpdate.purpose}`,
            message: replyText,
            reply_to: itemToUpdate.email,
          },
        )
        .then(
          (result) => {
            console.log(result.text);
            alert("回覆信件已成功發送！");
          },
          (error) => {
            console.log(error.text);
            alert("回覆發送失敗。");
          },
        );

      setReplyText("");
    } catch (error) {
      console.error("Error updating reply status or sending email:", error);
    }
  };

  const getCategoryColor = (subject) => {
    switch (subject) {
      case "問題詢問":
        return "bg-[#607B7D]";
      case "合作提案":
        return "bg-[#828E82]";
      case "給予建議":
        return "bg-[#AAAE8E]";
    }
  };

  const formatTime = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString();
    }
    return "未知時間";
  };

  return (
    <div className="mb-16 flex min-h-screen w-4/5 flex-col overflow-auto">
      <div className="mb-16 flex-1 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">表單管理</h1>
          <div className="space-x-2">
            <button
              onClick={() => setViewReplied(false)}
              className={`rounded-full px-4 py-2 ${
                !viewReplied ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              未回覆
            </button>
            <button
              onClick={() => setViewReplied(true)}
              className={`rounded-full px-4 py-2 ${
                viewReplied ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              已回覆
            </button>
          </div>
        </div>

        <div className="mt-8 h-screen">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="rounded-md bg-[#E0E0E0] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      className={`rounded-full px-4 py-2 text-white ${getCategoryColor(item.category)}`}
                    >
                      {item.category}
                    </button>
                    <span> 主旨：{item.purpose}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span> {formatTime(item.time)}</span>
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="rounded-full bg-[#3A606E] px-4 py-2 text-white"
                    >
                      {expandedItems[item.id] ? "收起" : "查看"}
                    </button>
                  </div>
                </div>

                {expandedItems[item.id] && (
                  <div className="mt-4 rounded-md bg-white p-4">
                    <p>主旨：{item.purpose}</p>
                    <p>創建時間：{formatTime(item.time)}</p>
                    <p>類別：{item.category}</p>
                    <p>姓名：{item.name}</p>
                    <p>Email：{item.email}</p>
                    <p>手機：{item.phone}</p>
                    <p>內容：{item.content}</p>

                    {!item.replied && (
                      <>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="mt-4 w-full rounded-md border p-2"
                          placeholder="在此輸入回覆..."
                        />
                        <div className="text-right">
                          <button
                            onClick={() => handleReply(item.id)}
                            className={`mt-4 rounded-full px-4 py-2 text-white ${
                              replyText.trim() === ""
                                ? "cursor-not-allowed bg-gray-300"
                                : "bg-gray-500"
                            }`}
                            disabled={replyText.trim() === ""}
                          >
                            送出
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
