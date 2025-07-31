import React from "react";

export default function FAQ() {
  return (
    <section className="w-full max-w-md mx-auto mt-12 mb-8 p-6 rounded-xl bg-black bg-opacity-60 text-white shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-amber-400">FAQ</h2>
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">What is a burner link?</h3>
        <p className="text-gray-200">A burner link is a one-time or limited-use link that self-destructs after being accessed or after a set time.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">How does "Burn after reading" work?</h3>
        <p className="text-gray-200">Once someone accesses the link, it is deleted and cannot be used again. You can also set a timer for automatic burning.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">Can I protect my link with a password?</h3>
        <p className="text-gray-200">Yes! Add a password when creating your burner link. Only users with the password can access the content.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">What happens when a link is burned?</h3>
        <p className="text-gray-200">The link is deleted from the system and cannot be accessed again. You will see a "This link has been burned" message.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">Is my data private?</h3>
        <p className="text-gray-200">Yes. Burner links are designed for privacy and security. Burner links are stored in MongoDB when not accessed yet. Messages and URLs are deleted after burning.</p>
        <br />
        <p className="text-gray-200">We do not track or log any personal information about users accessing burner links.</p>
        <br />
        <p className="text-gray-200">Additionally, Anor is E2EE (end-to-end encrypted) using AES-GCM, ensuring that only you and the intended recipient can access the content. This means that even we cannot read your messages/links. If we tried, we wouldn't be able to; the messages/links in the database stored are random, unintelligible strings of characters. The only ones who can decrypt the content are the sender and the recipient(s).</p>
        <br />
        <p className="text-gray-200">However, please note that while we take measures to protect your data, no system is completely immune to vulnerabilities. Always use burner links responsibly.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">What about link expiration?</h3>
        <p className="text-gray-200">Burner links can be set to expire after a certain time or number of views. Once expired, the link is burned and cannot be accessed.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">Can I create multiple burner links?</h3>
        <p className="text-gray-200">Absolutely! You can create as many burner links as you need, each with its own settings and expiration.</p>
      </div>
    </section>
  );
}
