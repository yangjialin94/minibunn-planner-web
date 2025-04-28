"use client";

import Link from "next/link";
import React from "react";

/**
 * Support Component
 */
function Support() {
  const supportItems = [
    {
      title: "General Support",
      description: "Contact us for any general questions or help.",
      link: "mailto:contact@minibunnplanner.com",
    },
    {
      title: "Report a Bug",
      description: "Found something broken? Let us know!",
      link: "mailto:contact@minibunnplanner.com?subject=%5BBug%5D%20Issue%20Description",
    },
    {
      title: "Suggest a New Feature",
      description: "Have an idea for a new feature?",
      link: "mailto:contact@minibunnplanner.com?subject=%5BFeature%5D%20Your%20Idea",
    },
    {
      title: "Improve Existing Features",
      description: "Suggestions to make our app better.",
      link: "mailto:contact@minibunnplanner.com?subject=%5BSuggestion%5D%20Your%20Feedback",
    },
    {
      title: "Account or Login Issues",
      description: "Need help accessing your account?",
      link: "mailto:contact@minibunnplanner.com?subject=%5BAccount%5D%20Account%20Help",
    },
    {
      title: "Billing & Subscription Help",
      description: "Questions about charges or subscriptions?",
      link: "mailto:contact@minibunnplanner.com?subject=%5BPayment%5D%20Billing%20Support",
    },
  ];

  return (
    <div className="overflow-y-auto p-6">
      <div className="flex flex-col flex-wrap gap-6">
        {supportItems.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="rounded-xl border p-4 hover:border-2"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-neutral-500">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Support;
