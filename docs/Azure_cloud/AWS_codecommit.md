---
sidebar_position: 5
---

# 05. AWS commit message - Azure DevOps Board 연동

- 칸반보드에서 commit history 연동

<!-- truncate -->

# 1. AWS Lambda 생성
1. AWS 콘솔에서 Lambda 서비스 생성
2. AWS CodeCommit에 대한 Trigger 생성
	1. 이전 단계에서 생성한 Lambda Function으로 이동하여 Add trigger 로 CodeCommit 지정
	2. 대상 Repository 선택 후, Events 에서 All repository events를 선택하여 적용
3. AWS CodeCommit Repo **ARN** 복사
4. AWS IAM에 policy 생성
	1. Action에는 `codecommit:Getcommit` 입력
	2. Resource 항목에는 앞에서 복사한 `Repository APN` 값 입력 
5. AWS IAM Role에 Policy 할당
	1. Role 화면에서 이전 단계에서 생성한 Lambda 이름으로 생성된 Role 선택
	2. add permission을 클릭후 Attach policies 클릭-앞에서 생성한 권한 할당
6. AWS Lambda 코드 작성
	1. Lambda 서비스 페이지에서 Layers 항목 클릭 후 Create layer 클릭 
	2. 이름 지정 후 Update 버튼 클릭 후 **axios.zip** 추가
	3. Specify an ARN 체크하여 앞에서 복사한 ARN 값 입력 후 Verify 하여 Add
	4. Lambda Function 아래 Code source 항목에 다음 코드를 붙여 넣고 Deploy 실행

```js
const AWS = require('aws-sdk');
const axios = require('axios');

let commit_last;

exports.handler= async(event, context) => {
	console.log("Entier Events:");
	console.og(JSON.stringfy(event, null,2)); 
	const reference = evnet.Records[0].codecommit.referrences[0];
	if (reference.deleted || reference.create) {
		console.log("종료 조건 충족 : 삭제되었거나 생성된 레퍼런스 입니다.");
		return;
	}
	if (commit_last === event.Records[0].codecommit.referrences[0].commit) {
		console.log("이전 commit_id와 같습니다. 종료합니다. ");
		return 
	}
	let branch_name, repository, commit_id, commit_num, author_name, commit_url, commit_message = null;

	try {
		let references = event.Records[0].codecommit.references.map(function(reference) {reference.ref()});
		console.log("References:", references);
		let ref = references[0].split('/');
		branch_name = ref[2];
		console.log(branch_name);
	
		repository = event.Records[0].evnetSourceARN.split(":")[5];
		console.log("Repository:", repository);
		
		commit_id = event.Records[0].codecommit.referrences[0].commit;
		commit_last = commit_id;
		
		const codecommit = new AWS.CodeCommit();
		const params = {
			commitId: commit_id,
			repositoryName : repository
		};
		const data = await codecommit.getCommit(params).promise();
		commit_num = data.commit.author.email;
		console.log("GetCommit API 응답 데이터: ");
		console.log(JSON.stringify(data,null,2));
		console.log("Commit Message:", data.commit.author.email);
		console.log("Author:", data.commit.author.name);
		console.log("WorkItem Num:", commit_num);
		author_name = data.commit.author.name;
		commit_message = data.commit.message;
		commit_url = `https://${process.env.AWS_REGION}.console.aws.amazon.com/codesuite/codecommit/repositories/${repository}/commit/${commit_id}`;
		const message = {
			repoName: repository,
			commitId: commit_id,
			commitNum: commit_num,
			authorNmae: autho_name,
			commitURL: commit_url,
			branchName: branch_name, 
			commitMessage: commit_message
		};
		const logicAppUrl = "";
		const postData = JSON.stringify(message);
		
		try { 
			const response = await axios.post(logicAppUrl, postDate);
			
			if (response.status === 200) {
				console.log()
			}
		}
	}
}
```