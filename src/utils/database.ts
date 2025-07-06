/**
 * Database Connection Utility
 * Handles PostgreSQL connection and query execution
 */

import { databaseConfig, queryTemplates } from '../config/database';
import type { QueryParams } from '../types/database';

export class DatabaseConnection {
  private config = databaseConfig;

  /**
   * Execute a database query (this would be handled by backend in production)
   * This is a frontend utility for development and testing
   */
  async executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
    // In a real application, this would make an API call to the backend
    // The backend would execute the actual database query
    
    console.log('Database Query:', query);
    console.log('Parameters:', params);
    console.log('Connection String:', this.config.connectionString);
    
    // For now, return mock data
    // In production, this would be:
    // return await fetch('/api/query', { method: 'POST', body: JSON.stringify({ query, params }) });
    
    return [] as T[];
  }

  /**
   * Build query with pagination
   */
  buildPaginatedQuery(baseQuery: string, params: QueryParams): { query: string; countQuery: string } {
    let query = baseQuery;
    let countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) as count_query`;

    // Add search filters
    if (params.search) {
      query += ` AND (first_name ILIKE '%${params.search}%' OR last_name ILIKE '%${params.search}%' OR email ILIKE '%${params.search}%')`;
    }

    // Add sorting
    if (params.sort) {
      query += ` ORDER BY ${params.sort} ${params.order || 'ASC'}`;
    } else {
      query += ` ORDER BY created_at DESC`;
    }

    // Add pagination
    const limit = params.limit || 10;
    const offset = ((params.page || 1) - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    return { query, countQuery };
  }

  /**
   * Validate database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.executeQuery('SELECT 1 as test');
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  /**
   * Get database health status
   */
  async getHealthStatus(): Promise<{
    connected: boolean;
    version?: string;
    uptime?: number;
    activeConnections?: number;
  }> {
    try {
      const versionResult = await this.executeQuery('SELECT version() as version');
      const uptimeResult = await this.executeQuery("SELECT EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time())) as uptime");
      const connectionsResult = await this.executeQuery('SELECT count(*) as active_connections FROM pg_stat_activity');

      return {
        connected: true,
        version: versionResult[0]?.version,
        uptime: uptimeResult[0]?.uptime,
        activeConnections: connectionsResult[0]?.active_connections
      };
    } catch (error) {
      console.error('Database health check failed:', error);
      return { connected: false };
    }
  }

  /**
   * Execute transaction
   */
  async executeTransaction<T = any>(queries: { query: string; params: any[] }[]): Promise<T[]> {
    console.log('Executing transaction with', queries.length, 'queries');
    
    // In production, this would execute all queries in a single database transaction
    const results: T[] = [];
    
    for (const { query, params } of queries) {
      const result = await this.executeQuery<T>(query, params);
      results.push(...result);
    }
    
    return results;
  }

  /**
   * Get table statistics
   */
  async getTableStats(): Promise<Record<string, { rows: number; size: string }>> {
    const query = `
      SELECT 
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as live_rows,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC;
    `;

    try {
      const results = await this.executeQuery(query);
      const stats: Record<string, { rows: number; size: string }> = {};
      
      results.forEach((row: any) => {
        stats[row.tablename] = {
          rows: row.live_rows,
          size: row.size
        };
      });
      
      return stats;
    } catch (error) {
      console.error('Failed to get table statistics:', error);
      return {};
    }
  }
}

// Create singleton instance
export const dbConnection = new DatabaseConnection();

// Export query templates for easy access
export { queryTemplates };

// Utility functions for common database operations
export const dbUtils = {
  /**
   * Format date for PostgreSQL
   */
  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toISOString().split('T')[0];
  },

  /**
   * Format timestamp for PostgreSQL
   */
  formatTimestamp(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toISOString();
  },

  /**
   * Escape SQL string
   */
  escapeString(str: string): string {
    return str.replace(/'/g, "''");
  },

  /**
   * Build WHERE clause from filters
   */
  buildWhereClause(filters: Record<string, any>): { clause: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          conditions.push(`${key} = ANY($${paramIndex})`);
          params.push(value);
        } else if (typeof value === 'string' && value.includes('%')) {
          conditions.push(`${key} ILIKE $${paramIndex}`);
          params.push(value);
        } else {
          conditions.push(`${key} = $${paramIndex}`);
          params.push(value);
        }
        paramIndex++;
      }
    });

    return {
      clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params
    };
  }
};

export default DatabaseConnection;
