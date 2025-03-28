import { spawn } from 'child_process';
import { existsSync } from 'fs';

// シンプルな通知テスト
function testNotify() {
  console.log('MCPサーバーで通知をテストします...');
  
  // ビルドファイルのパス
  const serverPath = '/Users/ueha-j/mcp-work/mcp-notifier/build/index.js';
  
  // ファイルの存在確認
  if (!existsSync(serverPath)) {
    console.error('エラー: サーバーファイルが見つかりません:', serverPath);
    return;
  }
  
  console.log('MCPサーバーを起動します...');
  
  // サーバープロセスを起動
  const serverProcess = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // エラー処理
  serverProcess.on('error', (err) => {
    console.error('サーバープロセスの起動エラー:', err);
  });
  
  // 標準エラー出力をログに記録
  serverProcess.stderr.on('data', (data) => {
    console.log('サーバーログ:', data.toString());
  });
  
  // 初期化リクエストを送信
  setTimeout(() => {
    console.log('初期化リクエストを送信します...');
    
    const initializeRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-01-01',
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        },
        capabilities: {}
      }
    };
    
    // リクエストをJSON形式で送信
    serverProcess.stdin.write(JSON.stringify(initializeRequest) + '\n');
    
    // 応答を受け取る
    const responseHandler = (data) => {
      console.log('サーバーからの応答 (初期化):', data.toString());
      
      // 初期化応答があれば、通知ツールを呼び出す
      try {
        const response = JSON.parse(data.toString());
        
        if (response.id === 1) {
          console.log('初期化完了、初期化通知を送信します...');
          
          // Initialize完了通知
          const initializedNotification = {
            jsonrpc: '2.0',
            method: 'initialized',
            params: {}
          };
          
          serverProcess.stdin.write(JSON.stringify(initializedNotification) + '\n');
          
          // 通知ツールを呼び出す
          setTimeout(() => {
            console.log('通知ツールを呼び出します...');
            
            const notifyRequest = {
              jsonrpc: '2.0',
              id: 2,
              method: 'tools/call',
              params: {
                name: 'notify',
                arguments: {
                  title: 'テスト通知',
                  message: 'MCPサーバーからのテスト通知です',
                  sound: true
                }
              }
            };
            
            serverProcess.stdin.write(JSON.stringify(notifyRequest) + '\n');
          }, 1000);
          
          // 応答ハンドラを更新
          serverProcess.stdout.removeListener('data', responseHandler);
          serverProcess.stdout.on('data', (data) => {
            console.log('サーバーからの応答 (通知結果):', data.toString());
            
            // 応答を受け取った後、プロセスをクリーンアップ
            setTimeout(() => {
              console.log('テスト完了、サーバーを終了します...');
              serverProcess.kill();
            }, 1000);
          });
        }
      } catch (err) {
        console.error('応答の解析エラー:', err);
      }
    };
    
    serverProcess.stdout.on('data', responseHandler);
  }, 2000);
}

// テスト実行
testNotify();
