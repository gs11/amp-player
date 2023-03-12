SERVICE=`grep ^service webui/serverless.yml|cut -d " " -f 2`
INSTANCE_ID=`aws cloudfront list-distributions --query "DistributionList.Items[?DefaultCacheBehavior.TargetOriginId=='$SERVICE-$ENVIRONMENT'].Id" --output text`
aws cloudfront create-invalidation --distribution-id $INSTANCE_ID --paths "/*" > /dev/null
