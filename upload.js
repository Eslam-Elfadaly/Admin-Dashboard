import { createClient } from "@supabase/supabase-js";
import dbData from "../Database/db.json" with { type: "json" };

const supabase = createClient(
  'https://zspqatmuzpthezzivgkk.supabase.co',
  'sb_publishable_1pVWsEhJ26VviLiHfuLTbA_7QscMw0A'
);

async function uploadTable(tableName, data) {
  const { error } = await supabase
    .from(tableName)
    .upsert(data);

  if (error) {
    console.log(`❌ ${tableName}:`, error.message);
  } else {
    console.log(`✅ ${tableName} uploaded`);
  }
}


async function upload() {
  console.log("🚀 Start uploading...");

  await uploadTable("products", dbData.products);

  await uploadTable("categories", dbData.categories);

  await uploadTable("customers", dbData.customers);

  await uploadTable("orders", dbData.orders);

  await uploadTable("notifications", dbData.notifications);


  const coupons = dbData.coupons.map(({ limit, ...coupon }) => ({
    ...coupon,
    couponLimit: limit
  }));

  await uploadTable("coupons", coupons);


  await uploadTable("dashboard_stats", [
  {
    id: "main",
    cards: dbData.dashboardStats.cards,
    salesSeries: dbData.dashboardStats.salesSeries,
    orderStatusSplit: dbData.dashboardStats.orderStatusSplit,
    topSellingProducts: dbData.dashboardStats.topSellingProducts,
    totals: dbData.dashboardStats.totals
  }
]);


  console.log("🎉 Finished");
}


upload();