# FORECasT 
###### Favoured Outcomes of Repair Events at Cas9 Targets

[![Docker Repository on Quay.io](https://quay.io/repository/coreos/quay-docs/status "Docker Repository on Quay.io")](https://quay.io/repository/cellgeni/mprofile-web)

FORECasT is a web application that gives access to a predictor of Cas9 editing outcome resulting from Cas9-induced double strand breaks. 
The paper is available on [BioRxiv](https://www.biorxiv.org/content/early/2018/08/25/400341), and the application itself at
https://partslab.sanger.ac.uk.

The application consists of two components: a React front end (this repository) and a
[predictor](https://github.com/felicityallen/SelfTarget).
Having it as two separate servers allows to decouple the model from the interface and develop both components 
independently.


## Running 

#### Locally

1. Start predictor server (see [README](https://github.com/felicityallen/SelfTarget/blob/master/README.md)). 
According to instructions, it will run on port 5001

2. Install packages and run the FORECasT server, it will be opened in a browser automatically
    ```bash
    npm install
    REACT_APP_MODEL_HOST=http://127.0.0.1:5001 npm run start
    ```


#### With Docker
```bash
docker pull quay.io/cellgeni/mprofile-web
docker pull quay.io/felicityallen/selftarget
docker network create forecast-net
docker run -d --name selftarget --net forecast-net quay.io/felicityallen/selftarget
docker run -d --name forecast -p 80:80 --net forecast-net -e "REACT_APP_MODEL_HOST=http://selftarget:8006" quay.io/cellgeni/mprofile-web
```
Open [http://127.0.0.1](http://127.0.0.1) in browser

Cleaning up
```bash
docker rm -f selftarget forecast
docker network rm forecast-net
```

#### With Kubernetes


1. Check  [FORECasT](quay.io/cellgeni/mprofile-web?tab=tags) and [SelfTarget](quay.io/felicityallen/selftarget?tab=tags) 
Docker images for the latest tags and update corresponding tags in `k8s/forecast.deployment.yaml` 
and `k8s/predictor.deployment.yaml` in "spec > template > spec > containers > image"
2. Deploy each component:
    ```
    kubectl apply -f k8s/forecast.deployment.yaml
    kubectl apply -f k8s/forecast.service.yaml
    kubectl apply -f k8s/predictor.deployment.yaml
    kubectl apply -f k8s/predictor.service.yaml
    ```
3. An external IP for the `forecast` service will be requested and assigned from the infrastructure provider. 
It can take a couple minutes.
    ```bash
    $ kubectl get services
    NAME              TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
    predictor         NodePort       10.233.48.4     <none>          80:31935/TCP     16d
    forecast          LoadBalancer   10.233.47.253   172.27.18.205   8000:32146/TCP   16d
    ``` 
    If EXTERNAL-IP is stuck in `pending` state, check the reason with `kubectl describe service forecast`.
