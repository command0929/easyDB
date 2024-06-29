importClass(android.database.sqlite.SQLiteDatabase);
importClass(android.content.ContentValues);
importClass(java.lang.Integer);

exports['open'] = (

/**
 *
 * @param {string} path - .db file path
 * @param {object} config - read, write, create ( if necessary )
 *
 * @return {object} - easyDB value
 */

function openDatabase (path, config) {
   let fileType = ".db";
   let File = new java.io.File(path);
   if(!File.exists() || File.isDirectory() || !File.isFile() || !File.getName().endsWith(fileType)) throw new Error('cannot open Database File!');
   let result = new setDatabase(path, getModeAsConfig(config));
   result.toString = (() => "[object easyDB]").bind({});
   return result;
});

/**
 *
 * @param {object} config - get sqliteDatabase OpenParams config
 * @param {boolean} config.write - can write
 * @param {boolean} config.read - can read
 * @param {boolean} config.create - create if necessary
 *
 * @return {number} - sqliteDatabase Openparams
 */

function getModeAsConfig (config) {
   config = config || {};
   let read = config.read || true;
   let write = config.read ? ( config.write ? true : false ) : true;
   let create = config.create || false;
   if(create) return SQLiteDatabase.CREATE_IF_NECESSARY;
   if(write) return SQLiteDatabase.OPEN_READWRITE;
   if(read) return SQLiteDatabase.OPEN_READONLY;
}

/**
 *
 * @param {string} File - .db file path
 * @param {number} OpenParams - OpenParams value
 *
 * @return {object} - SET Database value
 */

function setDatabase (File, OpenParams) {
   
   /* SET use variables */
   
   this.File = File;
   this.OpenParams = OpenParams;
   this.DB = SQLiteDatabase.openDatabase(File, null, OpenParams);
   
   /* SET use functions */
   
   /**
    *
    * @return {*} - close value
    */
   
   this.close = () => this.DB.close();
   
   /**
    *
    * @param {object} config - open config
    *
    * @return {*} - db value for test
    */
   
   this.reopen = (config) => {
      if(this.DB.isOpen()) this.DB.close();
      if(config) OpenParams = getModeAsConfig(config);
      return this.DB = SQLiteDatabase.openDatabase(File, null, OpenParams);
   }
   
   /**
    *
    * @param {string} sql - sql text
    * @param {array} whereArgs - sql WHERE ? value
    *
    * @return {*} - db cursor
    */
   
   this.getCursor = (sql, whereArgs) => this.DB.rawQuery(sql, whereArgs);
   
   /**
    *
    * @param {string} table_name - db table name
    * @param {object} data - put data  If key sames in row, edit the row
    *
    * @return {void} - no return
    */
   
   this.put = (table_name, data) => {
    this.DB.execSQL("CREATE TABLE IF NOT EXISTS " + table_name + " (key INTEGER PRIMARY KEY)");

    let keys = Object.keys(data);
    for (let column of keys) {
    try{
        this.DB.execSQL('alter table '+ table_name + ' add column ' + column + ' longtext');
        }catch (err) {
           // Log.error(err + "\n" + err.stack);
        }
    }

        let query = "SELECT * FROM " + table_name + " WHERE key=?";
        let cursor = this.DB.rawQuery(query, [data.key]);

        if (cursor.moveToFirst()) {
            cursor.close();
            let contentValues = new ContentValues();
            for(let key of keys) {
               let value = data[key];
               contentValues.put(key, value);
            }
            this.DB.update(table_name, contentValues, data.key + "=?", [value]);
        } else {
            cursor.close();
            const content = makeContent(data);
            this.DB.insert(table_name, null, content);
        }
    }
   
   /**
    *
    * @param {string} table_name - db table name
    * @param {object} data - get data config
    *
    * @return {array} - value list array JSON
    */
   
   this.get = (table_name, data) => {
    let cursor = this.DB.rawQuery("SELECT * FROM " + table_name + " WHERE " + data.key + "=?" + (data.sort ? " ORDER BY " + data.sort + "DESC" : ""), [data.value]);
    if(!cursor.moveToFirst()) return cursor.close(), null;
    cursor.moveToPosition(-1);
    let data = [];
    while(cursor.moveToNext()) {
    let result = {};
    for(let key of cursor.getColumnNames()) {
        let idx = cursor.getColumnIndex(key);
        let type = cursor.getType(idx);
        if(!type) result[key] = null;
        else if([1, 2].some(e => e == key)) result[key] = Number(cursor.getString(idx));
        else if(type == 3) result[key] = cursor.getString(idx);
        else if(type == 4) result[key] = cursor.getBlob(idx);
        else result[key] = cursor.getString(idx);
    }
    data.push(result);
    }
    return cursor.close(), data;
   }
   
   /**
    *
    * @param {string} table_name - db table name
    * @param {object} data - remove data config
    *
    * @return {boolean} - success remove value
    */
   
   this.remove = (table_name, data) => {
       let getCursor = this.DB.rawQuery("SELECT * FROM " + table_name + " WHERE " + data.key + "=?" + (data.sort ? " ORDER BY " + data.sort : ""), [data.value]);
       if(!getCursor.moveToFirst()) return gerCursor.close(), false;
       this.DB.delete(table_name, data.key + "=?" + (data.sort ? " ORDER BY " + data.sort + " DESC" : "") + (data.count ? " LIMIT " + data.count.toString() : ""), [data.value]);
       getCursor.close();
       return true;
   }
}

function makeContent(data) {
    const content = new ContentValues();
    for(let key in data) {
        let value = data[key]
        if(value == null) {
            content.putNull(key);
            continue;
        }
        content.put(key, ((typeof value) == "number" ? Integer(value) : value));
    }
    return content;
}