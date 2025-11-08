// --- فعلي: استدعاء /api/chat مع ستريم ---
try {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [...messages, userMessage],
      locale: locale, // 'ar' أو 'en'
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`HTTP ${response.status}`);
  }

  // حضّر رسالة فاضية للمساعد ونبنيها تدريجي مع الستريم
  setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    setMessages(prev => {
      const arr = [...prev];
      arr[arr.length - 1].content += chunk; // نضيف النص اللي وصل
      return arr;
    });
  }
} catch (error) {
  console.error("API call failed:", error);
  setMessages(prev => [...prev, { role: 'assistant', content: t('error') }]);
} finally {
  setIsLoading(false);
}
