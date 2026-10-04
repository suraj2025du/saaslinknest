import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL;

// Resilient in-memory mock database for environments without direct MySQL connectivity
function createMockDb() {
  console.warn('[AI Studio] Database running in in-memory mode.');

  const demoUser = {
    id: 1,
    name: 'Demo Creator',
    email: 'demo@linknest.tech',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    loginMethod: 'email',
    emailVerified: true,
    twoFactorEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const demoProfile = {
    id: 1,
    userId: 1,
    username: 'demo',
    bio: 'Digital creator, tech enthusiast & builder. Welcome to my personal hub!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    theme: 'modern-dark',
    backgroundColor: '#0B0F1A',
    gradientColor1: '#7C3AED',
    gradientColor2: '#EC4899',
    gradientDirection: 'to-br',
    buttonStyle: 'rounded-xl',
    fontFamily: 'Inter',
    animationEnabled: true,
    seoTitle: 'Demo Creator | LinkNest',
    seoDescription: 'Check out Demo Creator links, social profiles, and projects on LinkNest.',
    seoKeywords: 'creator, links, portfolio, demo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const demoLinks = [
    {
      id: 1,
      userId: 1,
      title: '🌟 My Portfolio & Projects',
      url: 'https://github.com',
      description: 'Explore my latest open source work and tools',
      position: 0,
      visible: true,
      type: 'link',
      clicks: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      title: '🐦 Follow on Twitter / X',
      url: 'https://x.com',
      description: 'Daily thoughts on design, tech and building in public',
      position: 1,
      visible: true,
      type: 'link',
      clicks: 28,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 1,
      title: '📺 YouTube Channel',
      url: 'https://youtube.com',
      description: 'Tutorials, devlogs, and tech reviews',
      position: 2,
      visible: true,
      type: 'link',
      clicks: 19,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      userId: 1,
      title: '💼 Connect on LinkedIn',
      url: 'https://linkedin.com',
      description: 'Professional experience and collaborations',
      position: 3,
      visible: true,
      type: 'link',
      clicks: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const demoSubscriptions = [
    {
      id: 1,
      userId: 1,
      plan: 'premium',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const demoBlogPosts = [
    {
      id: 1,
      slug: 'how-to-optimize-your-link-in-bio',
      title: '10 Tips to Double Your Link-in-Bio Clicks in 2026',
      excerpt: 'Discover actionable strategies to transform your creator landing page into a high-converting audience hub.',
      content: '# 10 Tips to Double Your Link-in-Bio Clicks\n\nHaving a link in bio is essential for every digital creator, marketer, and entrepreneur. Here are top strategies:\n\n## 1. Keep Your Core Offer Above the Fold\nMake sure your most important link or latest project is placed right at the top.\n\n## 2. Use High-Contrast Colors and Clear Labels\nAvoid ambiguous links. Use descriptive titles like "Get My Free Design System" instead of "Click Here".\n\n## 3. Keep It Updated\nReview and rotate your links weekly to match your current social media campaigns.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      authorName: 'LinkNest Editorial',
      published: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['Growth', 'Creators', 'Analytics'],
      seoTitle: '10 Tips to Double Your Link-in-Bio Clicks',
      seoDescription: 'Transform your link-in-bio into a high-converting creator hub with these 10 actionable tips.',
    },
  ];

  const mockStore: Record<string, any[]> = {
    users: [demoUser],
    profiles: [demoProfile],
    links: demoLinks,
    subscriptions: demoSubscriptions,
    analytics: [],
    adminConfig: [],
    admin_config: [],
    paymentGateways: [],
    payment_gateways: [],
    coupons: [],
    invoices: [{ id: 1, amount: 2900, status: 'paid', createdAt: new Date() }],
    feedbacks: [],
    contactSubmissions: [],
    contact_submissions: [],
    newsletterSubscribers: [],
    newsletter_subscribers: [],
    blogPosts: demoBlogPosts,
    blog_posts: demoBlogPosts,
    teamMembers: [],
    team_members: [],
    teamInvites: [],
    team_invites: [],
    rateLimits: [],
    rate_limits: [],
    notifications: [],
  };

  const getTableName = (table: any): string => {
    if (!table) return 'unknown';
    if (typeof table === 'string') return table;
    if (table[Symbol.for('drizzle:Name')]) return table[Symbol.for('drizzle:Name')];
    if (table._?.name) return table._.name;
    for (const [k, v] of Object.entries(schema)) {
      if (v === table) return k;
    }
    return 'unknown';
  };

  const extractValue = (whereClause: any): any => {
    if (!whereClause) return null;
    if (whereClause.right !== undefined) {
      return whereClause.right?.value !== undefined ? whereClause.right.value : whereClause.right;
    }
    if (whereClause.value !== undefined) return whereClause.value;
    return null;
  };

  const createQueryProxy = () => {
    return new Proxy({}, {
      get: (_, tableKey: string) => {
        const storeKey = tableKey in mockStore ? tableKey : getTableName((schema as any)[tableKey]);
        const list = mockStore[storeKey] || mockStore[tableKey] || [];
        return {
          findFirst: async (options?: any) => {
            if (!list.length) return null;
            if (options?.where) {
              const val = extractValue(options.where);
              if (val !== null && val !== undefined) {
                const match = list.find((item) =>
                  item.username === val ||
                  item.email === val ||
                  item.id === val ||
                  item.userId === val ||
                  item.slug === val
                );
                if (match) return match;
              }
            }
            return list[0] || null;
          },
          findMany: async (options?: any) => {
            let res = [...list];
            if (options?.where) {
              const val = extractValue(options.where);
              if (val !== null && val !== undefined) {
                const filtered = list.filter((item) =>
                  item.userId === val ||
                  item.username === val ||
                  item.visible === (val === true)
                );
                if (filtered.length) res = filtered;
              }
            }
            if (options?.limit) {
              res = res.slice(0, options.limit);
            }
            return res;
          },
        };
      },
    });
  };

  class ChainableQuery {
    private _table: string = '';
    private _data: any = null;
    private _action: 'select' | 'insert' | 'update' | 'delete' = 'select';
    private _selectArgs: any = null;
    private _whereVal: any = null;

    constructor(action: 'select' | 'insert' | 'update' | 'delete', selectArgs?: any) {
      this._action = action;
      this._selectArgs = selectArgs;
    }

    from(table: any) {
      this._table = getTableName(table);
      return this;
    }

    values(data: any) {
      this._data = data;
      return this;
    }

    set(data: any) {
      this._data = data;
      return this;
    }

    leftJoin(...args: any[]) {
      return this;
    }

    innerJoin(...args: any[]) {
      return this;
    }

    rightJoin(...args: any[]) {
      return this;
    }

    where(cond?: any) {
      this._whereVal = extractValue(cond);
      return this;
    }

    groupBy(...args: any[]) {
      return this;
    }

    having(...args: any[]) {
      return this;
    }

    orderBy(...args: any[]) {
      return this;
    }

    limit(n: number) {
      return this;
    }

    offset(n: number) {
      return this;
    }

    then(resolve: (val: any) => any, reject?: (err: any) => any) {
      try {
        const list = mockStore[this._table] || [];
        if (this._action === 'select') {
          if (this._selectArgs && typeof this._selectArgs === 'object') {
            const keys = Object.keys(this._selectArgs);
            if (keys.includes('count')) {
              return Promise.resolve(resolve([{ count: list.length }]));
            }
            if (keys.includes('total')) {
              const total = list.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
              return Promise.resolve(resolve([{ total }]));
            }
          }
          if (this._whereVal !== null && this._whereVal !== undefined) {
            const filtered = list.filter(item =>
              item.email === this._whereVal ||
              item.username === this._whereVal ||
              item.userId === this._whereVal ||
              item.id === this._whereVal
            );
            return Promise.resolve(resolve(filtered));
          }
          return Promise.resolve(resolve([...list]));
        }

        if (this._action === 'insert') {
          const newId = list.length > 0 ? Math.max(...list.map(i => i.id || 0)) + 1 : 1;
          const newRecord = { id: newId, ...this._data, createdAt: new Date(), updatedAt: new Date() };
          if (this._table && mockStore[this._table]) {
            mockStore[this._table].push(newRecord);
          }
          const res = Object.assign([{ insertId: newId, affectedRows: 1 }], { insertId: newId, affectedRows: 1 });
          return Promise.resolve(resolve(res));
        }

        if (this._action === 'update') {
          if (this._table && mockStore[this._table] && this._data) {
            mockStore[this._table].forEach(item => {
              Object.assign(item, this._data, { updatedAt: new Date() });
            });
          }
          const res = Object.assign([{ affectedRows: 1 }], { affectedRows: 1 });
          return Promise.resolve(resolve(res));
        }

        if (this._action === 'delete') {
          const res = Object.assign([{ affectedRows: 0 }], { affectedRows: 0 });
          return Promise.resolve(resolve(res));
        }

        return Promise.resolve(resolve([]));
      } catch (err) {
        if (reject) return reject(err);
        return Promise.resolve(resolve([]));
      }
    }
  }

  const mockDbInstance: any = {
    query: createQueryProxy(),
    select: (args?: any) => new ChainableQuery('select', args),
    insert: (table: any) => new ChainableQuery('insert').from(table),
    update: (table: any) => new ChainableQuery('update').from(table),
    delete: (table: any) => new ChainableQuery('delete').from(table),
    transaction: async (cb: (tx: any) => any) => {
      return await cb(mockDbInstance);
    },
  };

  return mockDbInstance;
}

let dbInstance: any;
if (databaseUrl && !databaseUrl.includes('localhost') && databaseUrl.startsWith('mysql')) {
  try {
    const cleanUri = databaseUrl.split('?')[0];
    const connection = mysql.createPool({
      uri: cleanUri,
      connectTimeout: 5000,
      waitForConnections: true,
      connectionLimit: 5,
    });
    dbInstance = drizzle(connection, { schema, mode: 'default' });
  } catch {
    dbInstance = createMockDb();
  }
} else {
  dbInstance = createMockDb();
}

export const db = dbInstance;

