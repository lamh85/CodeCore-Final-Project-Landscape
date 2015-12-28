# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151228014732) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "channels", force: :cascade do |t|
    t.integer  "client_id"
    t.integer  "revenue"
    t.text     "description"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

  add_index "channels", ["organization_id"], name: "index_channels_on_organization_id", using: :btree

  create_table "comparisons", force: :cascade do |t|
    t.integer  "org1"
    t.integer  "org2"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "competitions", force: :cascade do |t|
    t.integer  "competitor_id"
    t.text     "description"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

  add_index "competitions", ["organization_id"], name: "index_competitions_on_organization_id", using: :btree

  create_table "filters", force: :cascade do |t|
    t.string   "group"
    t.string   "organizations"
    t.string   "property"
    t.string   "equality"
    t.string   "search_term"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "search_id"
  end

  add_index "filters", ["search_id"], name: "index_filters_on_search_id", using: :btree

  create_table "locations", force: :cascade do |t|
    t.string   "name"
    t.string   "coordinates"
    t.integer  "parent_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "type"
  end

  create_table "market_filters", force: :cascade do |t|
    t.string   "property"
    t.string   "search_term"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "market_search_id"
  end

  add_index "market_filters", ["market_search_id"], name: "index_market_filters_on_market_search_id", using: :btree

  create_table "market_searches", force: :cascade do |t|
    t.integer  "filter_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "market_searches", ["filter_id"], name: "index_market_searches_on_filter_id", using: :btree

  create_table "markets", force: :cascade do |t|
    t.integer  "organization_id"
    t.string   "product"
    t.integer  "category_id"
    t.string   "country"
    t.integer  "sales"
    t.text     "description"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "province"
  end

  add_index "markets", ["category_id"], name: "index_markets_on_category_id", using: :btree
  add_index "markets", ["organization_id"], name: "index_markets_on_organization_id", using: :btree

  create_table "memberships", force: :cascade do |t|
    t.integer  "organization_id"
    t.integer  "user_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "memberships", ["organization_id"], name: "index_memberships_on_organization_id", using: :btree
  add_index "memberships", ["user_id"], name: "index_memberships_on_user_id", using: :btree

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.integer  "revenue"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "city"
    t.string   "province"
    t.string   "country"
    t.integer  "priority_id"
    t.string   "street"
  end

  add_index "organizations", ["priority_id"], name: "index_organizations_on_priority_id", using: :btree

  create_table "priorities", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "products", force: :cascade do |t|
    t.string   "item"
    t.string   "type"
    t.integer  "revenue"
    t.text     "description"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

  add_index "products", ["organization_id"], name: "index_products_on_organization_id", using: :btree

  create_table "searches", force: :cascade do |t|
    t.integer  "filter_id"
    t.string   "logic"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "searches", ["filter_id"], name: "index_searches_on_filter_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "password_digest"
    t.integer  "organization_id"
    t.string   "email"
  end

  add_index "users", ["organization_id"], name: "index_users_on_organization_id", using: :btree

  add_foreign_key "channels", "organizations"
  add_foreign_key "competitions", "organizations"
  add_foreign_key "filters", "searches"
  add_foreign_key "market_filters", "market_searches"
  add_foreign_key "market_searches", "filters"
  add_foreign_key "markets", "categories"
  add_foreign_key "markets", "organizations"
  add_foreign_key "memberships", "organizations"
  add_foreign_key "memberships", "users"
  add_foreign_key "organizations", "priorities"
  add_foreign_key "products", "organizations"
  add_foreign_key "searches", "filters"
  add_foreign_key "users", "organizations"
end
