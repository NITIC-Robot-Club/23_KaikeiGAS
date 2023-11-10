function insertLastUpdated() { 
 if(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName() != '購入申請所'){
  return;
 }
 //アクティブなスプレッドシートの特定のシートを指定 
 var ss = SpreadsheetApp.getActive().getSheetByName('購入申請所');
 //アクティブなセルの行数を取得
 var currentRow = ss.getActiveCell().getRow();
 //アクティブなセルの値を取得
 var currentCell = ss.getActiveCell().getValue();

 //更新日をいれる列をstringで指定、B+currentRowでB列のセルを指定できる
 var updateRange = ss.getRange('P' + currentRow);
 Logger.log(updateRange);
 
 if(currentRow>1){
  if(currentCell) {
   updateRange.setValue(new Date());
  }
 }
}
